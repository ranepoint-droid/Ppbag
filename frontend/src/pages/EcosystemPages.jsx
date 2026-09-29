import {useEffect,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {ArrowRight,ArrowUpRight,ScanLine,TrendingUp,Repeat2,Globe,Clock,Users} from 'lucide-react';
import {BagWorker} from '../components/Carry';
import {Economy} from '../components/Economy';
import {Reveal} from '../components/BagArt';
import {api} from '../lib/api';

const Breadcrumb=({page,id})=><div className="page-breadcrumb page-width"><Link to="/" data-testid={`${id}-home-link`}>Home</Link><span>/</span><strong data-testid={`${id}-breadcrumb`}>{page}</strong></div>;
const Related=({id,to,title,copy})=><div className="page-width related-page" data-testid={`${id}-related`}><div><span className="eyebrow">ANOTHER PART OF THE PICTURE</span><h2 data-testid={`${id}-related-title`}>{title}</h2><p data-testid={`${id}-related-copy`}>{copy}</p></div><Link className="button" to={to} data-testid={`${id}-related-link`}>Take a look <ArrowUpRight size={16}/></Link></div>;

export const BagWorkerPage=()=>{
 const navigate=useNavigate();
 return <div className="standalone-page worker-page" data-testid="bag-worker-page"><Breadcrumb page="Bag Worker" id="worker"/>
  <BagWorker onOpen={id=>navigate(`/token/${id}`)}/>
  <section className="page-width worker-process" id="worker-process" data-testid="worker-process"><div className="section-heading"><div><span className="eyebrow">ACTIVITY IN. POSSIBILITY OUT.</span><h2 data-testid="worker-process-heading">A worker. Not a promise.</h2><p data-testid="worker-process-description">A separate engine supporting project Bags, one settled trade at a time.</p></div><ScanLine size={30} strokeWidth={1.2}/></div>
   <div className="process-grid">{[[ScanLine,'01','Find the activity.','Bag Worker scans active projects across the ecosystem. Activity informs where it works; no project is guaranteed an allocation.'],[TrendingUp,'02','Put revenue to work.','Platform revenue supports the strategy. Positions can rise or fall, and an open position is not a reward.'],[Repeat2,'03','Return realized profit.','Only settled, positive profit goes into that project’s Bag. Losses do not create rewards, and the normal Bag cycle stays the same.']].map(([Icon,n,title,copy])=><Reveal key={n} className="process-item" data-testid={`worker-process-${n}`}><div><span>{n}</span><Icon size={22}/></div><h3>{title}</h3><p>{copy}</p></Reveal>)}</div>
   <p className="page-note" data-testid="worker-demo-note">The animation is an illustrative sequence. No live strategy, trading, or profit distribution is running.</p>
  </section>
  <Related id="worker" to="/global-bag" title="A Bag for the wider ecosystem." copy="Global Bag is different: shared asset vaults for eligible $PAPERBAG holders."/>
 </div>;
};

export const GlobalBagPage=()=>{
 const [data,setData]=useState(null),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;setError(false);Promise.all([api.get('/global'),api.get('/native')]).then(([g,n])=>active&&setData({global:g.data,native:n.data})).catch(()=>active&&setError(true));return()=>{active=false;};},[retry]);
 return <div className="standalone-page global-page" data-testid="global-bag-page"><Breadcrumb page="Global Bag" id="global"/>
  <div className="editorial-page-heading page-width global-page-heading"><div><span className="paper-tab">THE ECOSYSTEM'S SHARED POCKET</span><h1 data-testid="global-page-title">Many Bags.<br/>One bigger picture.</h1><p data-testid="global-page-description">Every project brings something to the table.<br/>The Global Bag keeps a little of that good going around.</p></div><img className="global-page-illustration" src="/images/paper-vaults.png" alt="Hand-drawn paper vaults" data-testid="global-page-illustration"/></div>
  <div className="page-width global-principles" data-testid="global-principles">{[[Globe,'Shared asset vaults','No fill target. No reset.'],[Clock,'A 24-hour rhythm','Designed for daily distributions.'],[Users,'For $PAPERBAG holders','Subject to holder eligibility.']].map(([Icon,title,copy],i)=><div key={title} data-testid={`global-principle-${i}`}><Icon size={20} strokeWidth={1.4}/><span><strong>{title}</strong><small>{copy}</small></span></div>)}</div>
  {error?<div className="page-width data-error" data-testid="global-load-error"><span>Couldn't load the vaults.</span><button className="text-link" data-testid="global-retry" onClick={()=>setRetry(x=>x+1)}>Try again <ArrowRight size={14}/></button></div>:!data?<div className="page-width global-loading" aria-busy="true" data-testid="global-loading">Unpacking the vaults…</div>:<Economy global={data.global} native={data.native}/>}
  <Related id="global" to="/bag-worker" title="Meet the one doing the legwork." copy="Bag Worker follows project activity and returns only realized positive profit to project Bags."/>
 </div>;
};