import {Globe,Users,Flame,RotateCcw,Clock} from 'lucide-react';
import {Reveal,BagArt} from './BagArt';
import {GlobalBagFlow} from './GlobalBagFlow';
import {amount,compact} from '../lib/api';

export const Economy=({global,native})=><section className="section page-width" id="economy" data-testid="economy-section">
 <div className="economy-grid">
  <Reveal className="global-card economy-card" id="global-bag">
   <div className="economy-card-heading"><span className="eyebrow">THE COMMUNITY VAULTS</span><Globe size={18}/></div>
   <h2 data-testid="global-heading">GLOBAL BAG</h2>
   <p data-testid="global-description">Every project contributes to Global Bag. Every 24 hours, Global Bag is distributed to $PAPERBAG holders and eligible project creators.</p>
   <div className="vault-list" data-testid="global-vaults">{global?.vaults.map(v=><div className="vault-row" data-testid={`vault-${v.asset.toLowerCase()}`} key={v.asset}><span className="asset-coin" style={{background:v.color}}>{({DOGE:'Ð',SOL:'◎',USDC:'$',BONK:'✳'})[v.asset]}</span><strong>{v.asset}</strong><span>{v.amount>1000000?compact(v.amount):amount(v.amount)}</span></div>)}</div>
   <div className="distribution-info" data-testid="global-distribution"><span><Clock size={14}/> GLOBAL DISTRIBUTION CYCLE<small>Every 24 hours · not live yet</small></span><strong>24<span>H</span></strong></div>
   <GlobalBagFlow id="global-flow"/>
   <p className="global-creator-note" data-testid="global-creator-eligibility">For eligible creators who have launched a project and keep it active.</p>
  </Reveal>
  <Reveal className="native-card economy-card" id="paperbag" delay={.12}>
   <div className="economy-card-heading"><span className="eyebrow">OUR TOKEN. OUR BAG.</span><span className="tiny-pill" data-testid="native-launch-status">NOT LAUNCHED</span></div>
   <h2 data-testid="native-heading">$PAPERBAG.</h2>
   <p data-testid="native-description">PAPERBAG has its own Bag.<br/>Fill it. Share it. Burn it. Repeat.</p>
   <div className="native-visual"><BagArt progress={native?.progress||0} animate/><span className="hand-note">we have one, too.</span><div className="native-progress" data-testid="native-bag-progress"><strong>{native?.asset_amount??'—'} <span>/ {native?.asset_target??'—'} SOL</span></strong><div className="progress-track"><span style={{width:`${native?.progress||0}%`}}/></div><small>ILLUSTRATIVE BAG · CYCLE #{String(native?.cycle||0).padStart(2,'0')}</small></div></div>
   <div className="native-rules" data-testid="native-mechanism"><div><Users size={17}/><strong>80% SHARE</strong><small>Back to holders</small></div><div><Flame size={17}/><strong>20% BUYBACK & BURN</strong><small>A little less supply</small></div></div>
   <div className="native-reset" data-testid="native-reset"><RotateCcw size={13}/> A permanent loop. Never creator-configurable.</div>
  </Reveal>
 </div>
 <Reveal className="economy-flow" data-testid="economy-flow"><GlobalBagFlow id="ecosystem-distribution-flow"/><small data-testid="global-illustrative-note">Illustrative balances. No live rewards or distributions.</small></Reveal>
</section>;