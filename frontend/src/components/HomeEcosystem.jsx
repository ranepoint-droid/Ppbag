import {Link} from 'react-router-dom';
import {ArrowUpRight,ArrowRight,Globe,ScanLine,Clock,Users} from 'lucide-react';
import {Reveal,BagArt} from './BagArt';

export const HomeEcosystem=()=> <div className="home-ecosystem">
 <section className="home-worker-band" data-testid="home-bag-worker-section">
  <div className="page-width home-feature-grid">
   <Reveal className="home-feature-copy">
    <span className="eyebrow" data-testid="home-worker-eyebrow">01 / A LITTLE HELP FOR YOUR BAG</span>
    <h2 data-testid="home-worker-heading">Big ideas.<br/>A little hard work.</h2>
    <p className="feature-name" data-testid="home-worker-name"><ScanLine size={18}/> Meet Bag Worker.</p>
    <p data-testid="home-worker-description">Your token has a Bag. Bag Worker gives it a helping hand. It puts platform revenue to work across active projects, following real activity instead of hype.</p>
    <p data-testid="home-worker-profit">When a trade closes in profit, that realized profit returns to the project's Bag. More for the Bag, without changing how it works.</p>
    <Link to="/bag-worker" className="button primary" data-testid="home-bag-worker-link">Meet Bag Worker <ArrowUpRight size={17}/></Link>
    <small data-testid="home-worker-risk">Trading involves risk. Profit and rewards are never guaranteed.</small>
   </Reveal>
   <Reveal className="worker-preview-art" delay={.1}>
    <div className="worker-preview-top"><span data-testid="home-worker-visual-label"><i className="status-dot"/> PUTTING ACTIVITY TO WORK</span><ScanLine size={20}/></div>
    <div className="worker-preview-bag"><BagArt progress={65} animate/><span className="hand-note">a little effort.<br/>a fuller Bag.</span></div>
    <div className="worker-preview-flow" data-testid="home-worker-flow"><span>Spot activity</span><ArrowRight size={15}/><span>Get to work</span><ArrowRight size={15}/><span>Return profit</span></div>
    <span className="worker-preview-note" data-testid="home-worker-preview-note">ILLUSTRATIVE PROCESS · NOT LIVE TRADING</span>
   </Reveal>
  </div>
 </section>
 <section className="page-width home-feature-grid home-global-section" data-testid="home-global-bag-section">
  <Reveal className="global-preview-art">
   <div className="global-preview-top"><Globe size={24}/><span data-testid="home-global-vaults-label">ONE ECOSYSTEM. A SHARED POCKET.</span></div>
   <div className="home-vault-coins" aria-label="Global Bag assets" data-testid="home-global-assets">{[['◎','SOL','#dedeea'],['$','USDC','#dce9f0'],['Ð','DOGE','#f3dfaa'],['✳','BONK','#f1c9b6']].map(([symbol,name,color])=><div key={name} data-testid={`home-vault-${name.toLowerCase()}`}><span style={{background:color}}>{symbol}</span><strong>{name}</strong></div>)}</div>
   <div className="global-preview-cadence" data-testid="home-global-cadence"><span><Clock size={17}/> DISTRIBUTION CYCLE</span><strong>24<span>H</span></strong></div>
   <div className="global-preview-holders" data-testid="home-global-beneficiaries"><Users size={16}/><span>For eligible $PAPERBAG holders.</span></div>
  </Reveal>
  <Reveal className="home-feature-copy" delay={.1}>
   <span className="eyebrow" data-testid="home-global-eyebrow">02 / GOOD THINGS ARE BETTER SHARED</span>
   <h2 data-testid="home-global-heading">Many projects.<br/>One Global Bag.</h2>
   <p data-testid="home-global-description">Some things are bigger than one token. Activity across Paperbag projects contributes to shared asset vaults — the Global Bag.</p>
   <p data-testid="home-global-distribution">Unlike a project's Bag, these vaults have no fill target or reset. Assets are designed to be shared with eligible $PAPERBAG holders every 24 hours.</p>
   <Link to="/global-bag" className="button" data-testid="home-global-bag-link">Unpack the Global Bag <ArrowUpRight size={17}/></Link>
   <small data-testid="home-global-status">Illustrative vaults. Live distributions have not started.</small>
  </Reveal>
 </section>
</div>;