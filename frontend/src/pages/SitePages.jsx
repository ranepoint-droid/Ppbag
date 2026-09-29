import {useEffect,useState} from 'react';
import {Link,useNavigate,useLocation,Navigate} from 'react-router-dom';
import {ArrowRight,ArrowUpRight,Plus,TrendingUp,Gift} from 'lucide-react';
import {api,compact} from '../lib/api';
import {Hero} from '../components/Hero';
import {BagArt,Reveal} from '../components/BagArt';
import {BagIndex} from '../components/BagIndex';
import {HomeEcosystem} from '../components/HomeEcosystem';
import {HowItWorks} from '../components/HowItWorks';
import {Leaderboard} from '../components/Leaderboard';
import {LaunchFlow} from '../components/LaunchFlow';
import {Faq,LaunchCta} from '../components/Footer';

export const HomePage=()=>{
 const [overview,setOverview]=useState(null);
 useEffect(()=>{let active=true;api.get('/overview').then(r=>active&&setOverview(r.data)).catch(()=>{});return()=>{active=false;};},[]);
 return <div data-testid="home-page"><Hero/>
  <div className="home-statline page-width" data-testid="home-overview"><span><i/> A LITTLE ECOSYSTEM. A LOT TO CARRY.</span><div data-testid="home-token-count"><strong>{overview?.projects??'—'}</strong> tokens</div><div data-testid="home-volume"><strong>{overview?`$${compact(overview.volume)}`:'—'}</strong> volume</div><div data-testid="home-bags-opened"><strong>{overview?.bags_opened??'—'}</strong> Bags opened</div><small>Illustrative activity</small></div>
  <BagIndex featured/>
  <section className="page-width home-concept" data-testid="home-concept"><div><span className="eyebrow">MORE THAN A TRADING PAIR</span><h2 data-testid="home-concept-title">A token. A Bag.<br/>A reason to hold it.</h2><Link to="/ecosystem" className="text-link" data-testid="home-ecosystem-link">How Paperbag works <ArrowUpRight size={16}/></Link></div>
   <div className="home-concept-steps">{[[Plus,'Launch an idea.','Create your token. Choose what your Bag holds.'],[TrendingUp,'Let activity fill it.','Trading fills the Bag. Bag Worker can lend a hand.'],[Gift,'Open. Reward. Repeat.','Share with holders or buy back and burn.']].map(([Icon,title,copy],i)=><Reveal key={title} delay={i*.1} data-testid={`home-concept-step-${i}`}><span className="concept-step-icon"><Icon size={18}/></span><h3>{title}</h3><p>{copy}</p></Reveal>)}</div>
  </section>
  <HomeEcosystem/><LaunchCta/>
 </div>;
};
export const BagsPage=()=> <div className="standalone-page" data-testid="bags-page"><div className="page-breadcrumb page-width"><Link to="/" data-testid="bags-home-link">Home</Link><span>/</span><strong>Explore tokens</strong></div><BagIndex/></div>;

export const EcosystemPage=()=>{
 const {hash}=useLocation(); const [overview,setOverview]=useState(null),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;api.get('/overview').then(r=>{if(active){setOverview(r.data);setError(false);}}).catch(()=>active&&setError(true));return()=>{active=false;};},[retry]);
 if(hash==='#carry'||hash==='#bag-worker')return <Navigate to="/bag-worker" replace/>;
 if(hash==='#global-bag')return <Navigate to="/global-bag" replace/>;
 if(hash==='#paperbag')return <Navigate to="/global-bag#paperbag" replace/>;
 return <div className="ecosystem-page standalone-page" data-testid="ecosystem-page">
  <div className="editorial-page-heading page-width"><span className="eyebrow">IT ALL COMES BACK TO THE BAG</span><h1 data-testid="ecosystem-page-title">Good things go around.</h1><p data-testid="ecosystem-page-description">From your project's first trade to its next Bag.<br/>Here's how Paperbag works.</p><div className="ecosystem-jumps"><a href="#how-it-works" data-testid="ecosystem-how-link">The Bag cycle</a><Link to="/bag-worker" data-testid="ecosystem-worker-link">Bag Worker <ArrowUpRight size={13}/></Link><Link to="/global-bag" data-testid="ecosystem-global-link">Global Bag <ArrowUpRight size={13}/></Link><Link to="/global-bag#paperbag" data-testid="ecosystem-native-link">$PAPERBAG <ArrowUpRight size={13}/></Link></div></div>
  {error&&<div className="data-error page-width" data-testid="ecosystem-error">Couldn't load ecosystem data.<button onClick={()=>setRetry(x=>x+1)} data-testid="ecosystem-retry" className="text-link">Retry</button></div>}
  <HowItWorks overview={overview}/><Faq/>
 </div>;
};
export const LeaderboardPage=()=>{const navigate=useNavigate();return <div className="standalone-page leaderboard-page" data-testid="leaderboard-page"><div className="page-breadcrumb page-width"><Link to="/" data-testid="leaderboard-home-link">Home</Link><span>/</span><strong>Leaderboard</strong></div><Leaderboard onOpen={id=>navigate(`/token/${id}`)}/></div>;};
export const LaunchPage=()=> <div className="launch-page page-width" data-testid="launch-page"><div className="launch-page-intro"><Link to="/bags" className="text-link" data-testid="launch-browse-link">Explore tokens <ArrowUpRight size={15}/></Link><span className="eyebrow">YOUR NEXT BIG THING</span><h1 data-testid="launch-page-title">PACK AN IDEA.<br/>MAKE IT YOURS.</h1><p data-testid="launch-page-description">A name, a little personality, and a Bag.<br/>That's where good things begin.</p><div className="launch-page-mascot"><BagArt progress={25} animate/><span className="hand-note">just add imagination.</span></div><div className="launch-page-notice" data-testid="launch-page-notice"><strong>Draft today. Launch when connected.</strong><p>Save your token and Bag settings. Real Pump.fun launches remain unavailable until the protocol is configured.</p></div></div><LaunchFlow open/></div>;
export const NotFoundPage=()=> <div className="page-width not-found-page" data-testid="not-found-page"><BagArt progress={0}/><h1 data-testid="not-found-heading">This Bag is empty.</h1><p data-testid="not-found-description">We couldn't find that page.</p><Link to="/bags" className="button primary" data-testid="not-found-explore">Explore tokens <ArrowRight size={16}/></Link></div>;