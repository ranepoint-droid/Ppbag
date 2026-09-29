import {ArrowRight,ArrowDown,Clock,Users,Hammer} from 'lucide-react';

export const GlobalBagFlow=({id})=> <div className="global-distribution-flow" data-testid={id}>
 <div className="global-contribution-path">
  <span data-testid={`${id}-contributions`}>Project contributions</span>
  <ArrowRight size={18} aria-hidden="true"/>
  <strong data-testid={`${id}-bag`}>Global Bag</strong>
 </div>
 <div className="global-distribution-cadence" data-testid={`${id}-cadence`}>
  <ArrowDown size={19} aria-hidden="true"/>
  <span><Clock size={13} aria-hidden="true"/> Every 24 hours</span>
 </div>
 <div className="global-recipient-branches">
  <div className="global-recipient" data-testid={`${id}-holders`}>
   <ArrowDown className="recipient-arrow" size={19} aria-hidden="true"/>
   <Users size={19} strokeWidth={1.5} aria-hidden="true"/>
   <strong>$PAPERBAG holders</strong>
  </div>
  <div className="global-recipient" data-testid={`${id}-creators`}>
   <ArrowDown className="recipient-arrow" size={19} aria-hidden="true"/>
   <Hammer size={19} strokeWidth={1.5} aria-hidden="true"/>
   <strong>Eligible project creators</strong>
  </div>
 </div>
</div>;