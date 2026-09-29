import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {ArrowUpRight,ArrowRight,Sparkles} from 'lucide-react';
import {EditorialMarquee} from './EditorialMarquee';

export const Hero=()=> <>
 <section className="paper-hero" style={{'--workshop-scene':"url('/images/paper-workshop.png')"}} data-testid="hero-section">
  <div className="hero-margin-notes" aria-hidden="true"><span>FIELD NOTES / No. 001</span><span>A LITTLE ECOSYSTEM<br/>WITH BIG IDEAS.</span><img src="/bag-mark.svg" alt=""/><span>HANDLE WITH<br/>POSSIBILITY.</span></div>
  <motion.div className="paper-hero-copy" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.65}}>
   <span className="hero-stamp" data-testid="hero-eyebrow"><Sparkles size={13}/> THE LITTLE TOKEN WORKSHOP</span>
   <div className="sketch-wordmark" data-testid="hero-wordmark">Paperbag<span>®</span></div>
   <h1 data-testid="hero-heading">Every Token Carries <span>a Bag.</span></h1>
   <p data-testid="hero-description">Big ideas start on paper.<br/>Launch a token. Fill a Bag. Put possibility to work.</p>
   <div className="paper-hero-actions"><Link to="/launch" className="button primary large" data-testid="hero-launch">Launch a token <ArrowUpRight size={18}/></Link><Link to="/bags" className="button large" data-testid="hero-explore">Explore Bags <ArrowRight size={17}/></Link></div>
   <Link to="/ecosystem" className="hand-note hero-how-link" data-testid="hero-how-it-works">wait, how does it work? ↗</Link>
  </motion.div>
  <div className="scene-label scene-label-left" data-testid="hero-scene-note">ideas go in. <span>↘</span></div>
  <div className="scene-label scene-label-right" data-testid="hero-scene-label"><span>↖</span> good things come out.</div>
  <span className="hero-demo-stamp" data-testid="hero-demo-notice">PAPER WORKSHOP · DEMO EDITION</span>
 </section>
 <EditorialMarquee/>
</>;