"""Activity for user-published demo tokens comes only from saved practice fills."""
from datetime import datetime, timezone, timedelta

async def enrich_project(db, project):
    if project.get('data_mode')!='simulation': return project
    project={**project}
    project['holders']=await db.simulations.count_documents({f"positions.{project['id']}.quantity":{'$gt':0}})
    totals=await db.simulations.aggregate([
        {'$unwind':'$trades'},{'$match':{'trades.project_id':project['id'],'trades.executed_at':{'$gte':(datetime.now(timezone.utc)-timedelta(hours=24)).isoformat()}}},
        {'$group':{'_id':None,'sol':{'$sum':'$trades.sol_amount'}}}
    ]).to_list(1)
    project['volume']=round((totals[0]['sol'] if totals else 0)*project['sol_price_usd'],6)
    return project

async def demo_trades(db, project_id):
    rows=await db.simulations.aggregate([
        {'$unwind':'$trades'},{'$match':{'trades.project_id':project_id}},
        {'$sort':{'trades.executed_at':-1}},{'$limit':500},
        {'$project':{'_id':0,'trade':'$trades','demo':'$id'}}
    ]).to_list(500)
    return [{**r['trade'],'trader':f"Demo {r['demo'][:4]}"} for r in rows]

async def demo_holders(db, project):
    field=f"positions.{project['id']}.quantity"
    states=await db.simulations.find({field:{'$gt':0}},{'_id':0,'id':1,'positions':1}).sort(field,-1).limit(10).to_list(10)
    return [{'rank':i+1,'label':f"Demo {s['id'][:4]}",
        'quantity':s['positions'][project['id']]['quantity'],
        'percentage':round(s['positions'][project['id']]['quantity']/project['supply']*100,4),
        'value_usd':s['positions'][project['id']]['quantity']*project['price_usd']}
        for i,s in enumerate(states)]

async def demo_candles(db, project, timeframe):
    interval={'1m':60,'5m':300,'15m':900,'1h':3600,'4h':14400}[timeframe]
    created=int(datetime.fromisoformat(project['created_at']).timestamp())
    now=int(datetime.now(timezone.utc).timestamp())
    start=max(created//interval*interval,(now//interval-119)*interval)
    trades=await demo_trades(db,project['id'])
    volumes={}
    for trade in trades:
        stamp=int(datetime.fromisoformat(trade['executed_at']).timestamp())//interval*interval
        volumes[stamp]=volumes.get(stamp,0)+trade['sol_amount']*project['sol_price_usd']
    p=project['price_usd']
    return [{'time':t,'open':p,'high':p,'low':p,'close':p,'volume':round(volumes.get(t,0),6)}
        for t in range(start,now//interval*interval+1,interval)]