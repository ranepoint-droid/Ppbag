import { useId } from 'react';
import { motion } from 'framer-motion';
import { Dog, Cat, Banana, Flame, Sprout } from 'lucide-react';
import {API} from '../lib/api';

export const BagArt = ({progress=60, className='', animate=false, open=false}) => {
  const id=useId().replace(/:/g,'');
  return <motion.svg className={`bag-art ${className}`} viewBox="0 0 160 180" fill="none" aria-label={`Paper bag ${Math.round(progress)}% full`} role="img" animate={animate?{rotate:[-3,2,-3],y:[0,-5,0]}:{}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}>
    <defs><clipPath id={id}><path d="M27 35 39 20 53 32 68 19 84 31 100 19 118 30 131 20 140 157 122 171 29 166 19 150Z"/></clipPath><pattern id={`${id}grain`} width="9" height="9" patternUnits="userSpaceOnUse"><path d="m1 8 5-5m-1 7 5-5" stroke="#725337" strokeWidth=".4" opacity=".24"/></pattern></defs>
    <ellipse cx="81" cy="174" rx="53" ry="4" fill="#33281c" opacity=".08"/>
    <path d="M27 35 39 20 53 32 68 19 84 31 100 19 118 30 131 20 140 157 122 171 29 166 19 150Z" fill="#ecddc2" stroke="#393127" strokeWidth="2.3" strokeLinejoin="round"/>
    <g clipPath={`url(#${id})`}><motion.rect x="15" width="130" height="160" fill="#c99b63" initial={false} animate={{y:170-progress*1.38}} transition={{duration:1.2,ease:'easeInOut'}}/><rect width="160" height="180" fill={`url(#${id}grain)`}/></g>
    <path d="m27 35 19 111-17 20m17-20 76 8 18 3M131 20l-9 134" stroke="#393127" strokeWidth="1.7" strokeLinejoin="round"/>
    <path d="m46 38 16 10 23-7" stroke="#fff4de" strokeWidth="2" opacity=".7"/>
    <motion.ellipse cx="79" cy="30" rx="48" ry="8" fill="#63503a" initial={false} animate={{opacity:open?1:0,scaleY:open?1:0}} transition={{duration:.6}}/>
    <motion.path d="M30 30 40 17 53 27 69 15 80 26 80 31Z" fill="#ddbf95" stroke="#393127" strokeWidth="1.5" initial={false} animate={{opacity:open?1:0,rotate:open?-16:0,x:open?-5:0,y:open?-3:0}} style={{transformOrigin:'30px 30px'}} transition={{duration:.7}}/>
    <motion.path d="M80 26 98 15 116 27 130 17 131 31 80 31Z" fill="#d4ae7e" stroke="#393127" strokeWidth="1.5" initial={false} animate={{opacity:open?1:0,rotate:open?16:0,x:open?5:0,y:open?-3:0}} style={{transformOrigin:'130px 30px'}} transition={{duration:.7}}/>
  </motion.svg>;
};
export const TokenAvatar = ({project, small=false}) => {
  const Icon={dog:Dog,cat:Cat,ape:Banana,bonk:Flame,pepe:Sprout,wif:Dog}[project.icon]||Dog;
  return <span className={`token-avatar ${small?'small':''}`} style={{background:project.color}} aria-hidden="true">{project.image_id?<img src={`${API}/files/${project.image_id}`} alt=""/>:project.icon==='bag'?<BagArt progress={30}/>:<Icon size={small?19:25} strokeWidth={1.5}/>}</span>;
};
export const Reveal = ({children,className='',delay=0,...props}) => <motion.div initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.7,delay,ease:[.22,1,.36,1]}} className={className} {...props}>{children}</motion.div>;