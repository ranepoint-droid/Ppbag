import {useEffect,useRef} from 'react';
const phrase='LAUNCH AN IDEA     ✳     FILL THE BAG     ✳     SHARE THE GOOD STUFF     ✳     CARRY IT FORWARD     ✳     ';
export const EditorialMarquee=()=>{
 const ref=useRef(null);
 useEffect(()=>{
  let active=true;
  document.fonts.ready.then(()=>{
   if(!active||!ref.current)return;
   const range=document.createRange();range.setStart(ref.current.firstChild,0);range.setEnd(ref.current.firstChild,phrase.length);
   ref.current.style.setProperty('--marquee-distance',`-${range.getBoundingClientRect().width}px`);
  });
  return()=>{active=false;};
 },[]);
 return <div className="marquee" aria-label="Launch an idea. Fill the Bag. Share the good stuff. Carry it forward." data-testid="editorial-marquee"><div className="marquee-window"><span ref={ref} className="marquee-text" aria-hidden="true">{phrase.repeat(5)}</span></div></div>;
};