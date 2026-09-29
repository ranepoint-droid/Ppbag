import {Link} from 'react-router-dom';
import {ArrowUpRight,ArrowRight} from 'lucide-react';
import {Reveal} from './BagArt';
import {GlobalBagFlow} from './GlobalBagFlow';

export const HomeEcosystem=()=> <div className="home-ecosystem">
 <section className="home-worker-band" data-testid="home-bag-worker-section"><div className="page-width home-feature-grid">
  <Reveal className="home-feature-copy"><span className="paper-tab" data-testid="home-worker-eyebrow">FIELD NOTE 01 / THE HELPFUL ONE</span><h2 data-testid="home-worker-heading">Every Token Has a <span>Bag Worker.</span></h2><p data-testid="home-worker-description">A little engine behind your big idea. Bag Worker puts platform revenue to work across active projects, following activity instead of hype.</p><p data-testid="home-worker-profit">Only settled, positive profit goes back into a project's Bag. The Bag fills a little further. The good keeps going.</p><Link to="/bag-worker" className="button primary" data-testid="home-bag-worker-link">See the worker at work <ArrowUpRight size={17}/></Link><small data-testid="home-worker-risk">An illustrated process. Trading carries risk; profits aren't promised.</small></Reveal>
  <Reveal className="worker-sketch-visual" delay={.1}><span className="hand-note art-annotation">a little effort. a fuller Bag. ↙</span><img src="/images/paper-worker.png" alt="2D ink sketch of the Bag Worker paper workshop" loading="lazy" data-testid="home-worker-illustration"/><div className="sketch-flow" data-testid="home-worker-flow"><span>Find activity</span><ArrowRight size={17}/><span>Get to work</span><ArrowRight size={17}/><span>Return profit</span></div></Reveal>
 </div></section>
 <section className="page-width home-feature-grid home-global-section" data-testid="home-global-bag-section">
  <Reveal className="vault-sketch-visual"><img src="/images/paper-vaults.png" alt="2D paper vaults sharing coins with one larger bag" loading="lazy" data-testid="home-global-illustration"/><div className="home-vault-tags" data-testid="home-global-assets">{['SOL','USDC','DOGE','BONK'].map(a=><span key={a} data-testid={`home-vault-${a.toLowerCase()}`}>{a}</span>)}</div><span className="hand-note vault-annotation">many little contributions. one bigger picture.</span></Reveal>
  <Reveal className="home-feature-copy" delay={.1}>
   <span className="paper-tab" data-testid="home-global-eyebrow">FIELD NOTE 02 / THE SHARED ONE</span>
   <h2 data-testid="home-global-heading">GLOBAL BAG</h2>
   <p data-testid="home-global-description">Every project contributes to Global Bag.</p>
   <p data-testid="home-global-distribution">Every 24 hours, Global Bag is distributed to $PAPERBAG holders and eligible project creators.</p>
   <GlobalBagFlow id="home-global-flow"/>
   <p className="global-creator-note" data-testid="home-global-creator-eligibility">Creators who launch and keep their projects active have a reason to be part of the ecosystem too — not just token holders.</p>
   <Link to="/global-bag" className="button" data-testid="home-global-bag-link">Unpack the Global Bag <ArrowUpRight size={17}/></Link>
   <small data-testid="home-global-status">Illustrative vaults. Live distributions have not started.</small>
  </Reveal>
 </section>
</div>;