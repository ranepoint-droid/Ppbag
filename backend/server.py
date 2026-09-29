import os
import uuid
import logging
from pathlib import Path
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from typing import Literal
from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Query
from fastapi.responses import Response
from starlette.concurrency import run_in_threadpool
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, field_validator

load_dotenv(Path(__file__).parent / '.env')
from seed import PROJECTS, VAULTS
from storage import put_object, get_object
from market import market_fields, create_market_router
from simulation import create_simulation_router
from launching import create_launch_router
from launched_market import enrich_project

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

@asynccontextmanager
async def lifespan(app):
    await db.projects.create_index('id', unique=True)
    await db.projects.create_index('launch_request_id', unique=True, sparse=True)
    await db.files.create_index('id', unique=True)
    await db.simulations.create_index('id', unique=True)
    for project in PROJECTS:
        await db.projects.update_one({'id': project['id']}, {'$setOnInsert': project.copy()}, upsert=True)
        await db.projects.update_one({'id':project['id'],'price_usd':{'$exists':False}},{'$set':market_fields(project['id'])})
    yield
    client.close()

app = FastAPI(title='Paperbag', lifespan=lifespan)
api = APIRouter(prefix='/api')
app.add_middleware(CORSMiddleware, allow_origins=os.environ['CORS_ORIGINS'].split(','), allow_credentials=False, allow_methods=['GET','POST','PUT','DELETE'], allow_headers=['Content-Type'])

class PublicModel(BaseModel):
    model_config = ConfigDict(extra='ignore', allow_inf_nan=False)

class Project(PublicModel):
    id: str
    name: str
    ticker: str
    description: str
    asset: str
    target_sol: float
    asset_target: float
    asset_amount: float
    progress: float
    mode: str
    carry_status: str
    carry_pnl: float
    carry_added: float
    cycle: int
    volume: float
    fastest_hours: float
    color: str
    icon: str
    history: list[dict]
    data_mode: str = 'illustrative'
    price_usd: float
    price_sol: float
    sol_price_usd: float
    market_cap: float
    fdv: float
    supply: float
    holders: int
    liquidity: float
    change_5m: float
    change_1h: float
    change_6h: float
    change_24h: float
    bonding_progress: float
    market_status: str
    market_snapshot: int
    created_at: str
    mint_address: str | None = None
    protocol: str
    image_id: str | None = None
    website: str = ''
    twitter: str = ''
    telegram: str = ''
    global_asset: str | None = None
    is_launched: bool = False

class FileInfo(PublicModel):
    id: str
    filename: str
    content_type: str
    size: int

@api.get('/')
async def health():
    return {'status':'ok','product':'Paperbag','live_transactions':False}

@api.get('/config')
async def config():
    return {'live_transactions':False, 'wallet_enabled':False, 'demo_wallet_enabled':True, 'demo_launch_enabled':True, 'data_mode':'simulation', 'assets':['SOL','USDC','DOGE','SHIB','BONK'], 'global_interval_hours':24}

@api.get('/projects', response_model=list[Project])
async def projects(sort: Literal['trending','volume','closest','opened','carry','mcap','holders','newest'] = 'trending', search: str = Query(default='', max_length=60)):
    records = await db.projects.find({}, {'_id':0}).sort('created_at',-1).to_list(1000)
    if search:
        records = [p for p in records if search.lower() in (p['name']+' '+p['ticker']+' '+p['asset']).lower()]
    records = [await enrich_project(db,p) for p in records]
    keys = {'trending':lambda p:p['volume']*(1+p['progress']/100), 'volume':lambda p:p['volume'], 'closest':lambda p:p['progress'], 'opened':lambda p:p['cycle']-1, 'carry':lambda p:(p['carry_status']=='Active',p['carry_pnl'])}
    keys.update({'mcap':lambda p:p['market_cap'],'holders':lambda p:p['holders'],'newest':lambda p:p['created_at']})
    return sorted(records, key=keys[sort], reverse=True)

@api.get('/projects/{project_id}', response_model=Project)
async def project(project_id: str):
    result = await db.projects.find_one({'id':project_id}, {'_id':0})
    if not result:
        raise HTTPException(404,'This Bag was not found')
    return await enrich_project(db,result)

@api.get('/overview')
async def overview():
    records = [await enrich_project(db,p) for p in await db.projects.find({}, {'_id':0}).to_list(1000)]
    return {'projects':len(records),'bags_opened':sum(p['cycle']-1 for p in records),'volume':sum(p['volume'] for p in records),'carry_profit':round(sum(p['carry_added'] for p in records),2),'data_mode':'illustrative'}

@api.get('/global')
async def global_bag():
    return {'vaults':VAULTS,'interval_hours':24,'status':'Preview · distributions not live','data_mode':'illustrative'}

@api.get('/native')
async def native_bag():
    return {'ticker':'PAPERBAG','asset':'SOL','asset_amount':32.6,'asset_target':50,'progress':65.2,'cycle':4,'mechanism':['Fill the Bag','80% Share','20% Buyback & Burn','Reset'],'configurable':False,'launched':False,'data_mode':'illustrative'}

@api.get('/leaderboard', response_model=list[Project])
async def leaderboard(category: Literal['opened','biggest','fastest','profits','active'] = 'opened'):
    records = [await enrich_project(db,p) for p in await db.projects.find({}, {'_id':0}).to_list(1000)]
    key = {'opened':'cycle','biggest':'target_sol','fastest':'fastest_hours','profits':'carry_pnl','active':'volume'}[category]
    if category=='fastest': records=[p for p in records if p['fastest_hours']>0]
    return sorted(records,key=lambda p:p[key],reverse=category!='fastest')[:5]

@api.post('/uploads', response_model=FileInfo, status_code=201)
async def upload(file: UploadFile = File(...)):
    data = await file.read(5*1024*1024+1)
    if len(data)>5*1024*1024:
        raise HTTPException(413,'Image must be smaller than 5 MB')
    types = {'image/png':('png', data.startswith(b'\x89PNG\r\n\x1a\n')), 'image/jpeg':('jpg',data.startswith(b'\xff\xd8\xff')), 'image/webp':('webp',data.startswith(b'RIFF') and data[8:12]==b'WEBP')}
    if file.content_type not in types or not types[file.content_type][1]:
        raise HTTPException(415,'Choose a valid PNG, JPG, or WebP image')
    file_id = str(uuid.uuid4())
    path = f'paperbag/uploads/{file_id}.{types[file.content_type][0]}'
    try:
        result = await run_in_threadpool(put_object,path,data,file.content_type)
    except Exception:
        logging.exception('Image upload failed')
        raise HTTPException(503,'Image storage is temporarily unavailable. Please try again.')
    record = {'id':file_id,'filename':file.filename,'content_type':file.content_type,'size':len(data),'storage_path':result['path'],'is_deleted':False,'created_at':datetime.now(timezone.utc).isoformat()}
    await db.files.insert_one(record.copy())
    return FileInfo(**record)

@api.get('/files/{file_id}')
async def download(file_id: str):
    record = await db.files.find_one({'id':file_id,'is_deleted':False},{'_id':0})
    if not record:
        raise HTTPException(404,'Image not found')
    try:
        data, _ = await run_in_threadpool(get_object,record['storage_path'])
    except Exception:
        raise HTTPException(503,'Image temporarily unavailable')
    return Response(data,media_type=record['content_type'],headers={'Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'})

app.include_router(api)
app.include_router(create_market_router(db))
app.include_router(create_simulation_router(db))
app.include_router(create_launch_router(db,Project))