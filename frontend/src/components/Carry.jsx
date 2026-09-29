import {useEffect,useState} from 'react';
import {motion,AnimatePresence,useReducedMotion} from 'framer-motion';
import {ArrowUpRight,ArrowRight,Pause,Play,ScanLine} from 'lucide-react';
import {Reveal,TokenAvatar} from './BagArt';

const nodes=[
 {id:'dog',ticker:'DOG',icon:'dog',color:'#f3ddaa',volume:'$2.4M'},
 {id:'cat',ticker:'CAT',icon:'cat',color:'#e3dded',volume:'$840K'},
 {id:'ape',ticker:'APE',icon:'ape',color:'#d9e4cc',volume:'$1.8M'},
 {id:'bonk',ticker:'BONK',icon:'bonk',color:'#f1c9b6',volume:'$1.3M'}
];
const phases=[['Looking for activity…','Scanning the ecosystem'],['Working on $DOG','Following activity. Not hype.'],['Buy. Hold. Sell.','Closing the example trade'],['+0.82 SOL realized','Added to the DOGE Bag'],['Back to work.','A little more in the Bag.']];

export const BagWorker=({onOpen})=>{
 const [phase,setPhase]=useState(0),[paused,setPaused]=useState(false); const reduced=useReducedMotion();
 useEffect(()=>{if(paused||reduced)return;const t=setInterval(()=>setPhase(p=>(p+1)%5),3000);return()=>clearInterval(t);},[paused,reduced]);
 return <section id="bag-worker" className="worker-stage" data-testid="bag-worker-section">
  <Reveal className="carry-section-inner page-width">
   <div className="carry-copy">
    <span className="eyebrow" data-testid="worker-eyebrow"><i className="status-dot"/> A LITTLE HELP. A LITTLE MORE IN THE BAG.</span>
    <h1 data-testid="bag-worker-heading">MEET THE<br/><span>BAG WORKER.</span></h1>
    <p className="carry-lead" data-testid="bag-worker-tagline">Working for the ecosystem.<br/>One Bag at a time.</p>
    <p data-testid="bag-worker-description">Bag Worker puts Paperbag revenue to work across active projects. It follows trading activity, and only realized positive profit makes it back into a project's Bag.</p>
    <a className="text-link light" href="#worker-process" data-testid="bag-worker-how-link">Follow the process <ArrowRight size={16}/></a>
    <div className="carry-disclaimer" data-testid="bag-worker-risk">Bag Worker takes risk. Profit isn't promised.<br/>Your Bag is never guaranteed to fill.</div>
   </div>
   <div className="carry-map-wrap">
    <div className="map-heading"><span className="eyebrow" data-testid="worker-map-label">BAG WORKER AT WORK</span><span className="small-label">ILLUSTRATIVE SEQUENCE</span><button aria-label={paused?'Play Bag Worker animation':'Pause Bag Worker animation'} title={paused?'Play animation':'Pause animation'} aria-pressed={paused} onClick={()=>setPaused(!paused)} data-testid="bag-worker-pause" className="icon-button">{paused?<Play size={14}/>:<Pause size={14}/>}</button></div>
    <div className={`carry-map phase-${phase} ${paused||reduced?'is-paused':''}`}>
     <svg className="map-lines" viewBox="0 0 500 330" preserveAspectRatio="none" aria-hidden="true"><path d="M100 70 250 165 400 70M250 165 100 270M250 165 400 270"/><circle className="carry-trail-dot" cx="250" cy="165" r="4" fill="#a38c58"/></svg>
     {nodes.map((p,i)=><button key={p.id} className={`project-node node-${i} ${phase>0&&phase<4&&i===0?'node-active':''}`} data-testid={`bag-worker-node-${p.id}`} onClick={()=>onOpen(p.id)}><TokenAvatar project={p} small/><strong>${p.ticker}</strong><small>{p.volume} vol.</small>{i===0&&phase===3&&<motion.span className="profit-drop" initial={{y:-15,opacity:0}} animate={{y:0,opacity:1}}>+0.82 SOL</motion.span>}</button>)}
     <motion.div className="carry-character" animate={{x:phase===1||phase===2?-38:0,y:phase===1||phase===2?-30:0,rotate:phase===1?-8:0}} transition={{duration:reduced?0:1.5,ease:'easeInOut'}}><div className="scan-ring"/><img src="/bag-mark.svg" alt="Plain kraft paper bag" data-testid="worker-plain-bag"/><span>BAG WORKER <ScanLine size={11}/></span></motion.div>
     <div className="map-note hand-note">always on the lookout ↗</div>
    </div>
    <AnimatePresence mode="wait"><motion.div key={phase} className="carry-status" initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} exit={{opacity:0}} data-testid="bag-worker-animation-status"><span className="status-dot"/><div><b>{phases[phase][0]}</b><small>{phases[phase][1]}</small></div><ArrowUpRight size={18}/></motion.div></AnimatePresence>
   </div>
  </Reveal>
 </section>;
};