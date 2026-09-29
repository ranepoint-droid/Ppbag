"""Publish demo tokens directly to the platform. Never creates on-chain assets."""
import hashlib
import json
import uuid
from datetime import datetime, timezone
from typing import Literal
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field, field_validator
from pymongo.errors import DuplicateKeyError

class LaunchInput(BaseModel):
    model_config = ConfigDict(extra='forbid', allow_inf_nan=False)
    name: str = Field(min_length=1, max_length=32)
    ticker: str = Field(pattern=r'^[A-Z0-9]{1,10}$')
    description: str = Field(min_length=1, max_length=500)
    image_id: str | None = None
    website: str = Field(default='', max_length=250)
    twitter: str = Field(default='', max_length=250)
    telegram: str = Field(default='', max_length=250)
    target_sol: float = Field(gt=0, le=1000000)
    asset: Literal['SOL','USDC','DOGE','SHIB','BONK']
    global_asset: Literal['SOL','USDC','DOGE','SHIB','BONK']
    mode: Literal['SHARE','BURN']
    simulation_id: uuid.UUID
    request_id: uuid.UUID
    wallet_provider: Literal['Phantom','Solflare']

    @field_validator('name','description')
    @classmethod
    def clean_text(cls,value):
        if not value.strip(): raise ValueError('Please enter a value')
        return value.strip()

    @field_validator('website','twitter','telegram')
    @classmethod
    def safe_link(cls,value):
        from urllib.parse import urlparse
        if value and (urlparse(value).scheme != 'https' or not urlparse(value).netloc):
            raise ValueError('Use a complete HTTPS link')
        return value

def create_launch_router(db, project_model):
    router=APIRouter(prefix='/api')

    @router.post('/launch', response_model=project_model, status_code=201)
    async def launch(data: LaunchInput):
        # A simulation ID is an anonymous demo handle, NOT wallet authentication.
        if not await db.simulations.find_one({'id':str(data.simulation_id)}, {'_id':0,'id':1}):
            raise HTTPException(422,'Reconnect your demo wallet and try again')
        payload=data.model_dump(mode='json')
        digest=hashlib.sha256(json.dumps(payload,sort_keys=True).encode()).hexdigest()
        key=str(data.request_id)
        existing=await db.projects.find_one({'launch_request_id':key},{'_id':0})
        if existing:
            if existing.get('launch_fingerprint')!=digest: raise HTTPException(409,'This deploy request was already used. Refresh and try again.')
            return project_model(**existing)
        if data.image_id and not await db.files.find_one({'id':data.image_id,'is_deleted':False},{'_id':0,'id':1}):
            raise HTTPException(422,'Upload your token image again')
        now=datetime.now(timezone.utc)
        rates={'SOL':1,'USDC':150,'DOGE':100000,'SHIB':13333333.333333,'BONK':10000000}
        metadata={k:payload[k] for k in ['name','ticker','description','image_id','website','twitter','telegram','target_sol','asset','global_asset','mode']}
        record={**metadata,'id':str(uuid.uuid4()),'asset_target':round(data.target_sol*rates[data.asset],6),
            'asset_amount':0,'progress':0,'carry_status':'Assigned','carry_pnl':0,'carry_added':0,
            'cycle':1,'volume':0,'fastest_hours':0,'color':'#f3d67b','icon':'bag','history':[],
            'data_mode':'simulation','is_launched':True,'price_usd':0.000006,'price_sol':0.000006/150,
            'sol_price_usd':150,'market_cap':6000,'fdv':6000,'supply':1000000000,'holders':0,
            'liquidity':0,'change_5m':0,'change_1h':0,'change_6h':0,'change_24h':0,
            'bonding_progress':0,'market_status':'Launched','market_snapshot':int(now.timestamp()),
            'created_at':now.isoformat(),'mint_address':None,'protocol':'Paperbag Demo',
            'launch_request_id':key,'launch_fingerprint':digest,'wallet_provider':data.wallet_provider,
            'creator_demo_id':str(data.simulation_id)}
        try:
            await db.projects.insert_one(record.copy())
        except DuplicateKeyError:
            existing=await db.projects.find_one({'launch_request_id':key},{'_id':0})
            if not existing or existing.get('launch_fingerprint')!=digest:
                raise HTTPException(409,'Deploy request conflict. Please try again.')
            return project_model(**existing)
        return project_model(**record)
    return router