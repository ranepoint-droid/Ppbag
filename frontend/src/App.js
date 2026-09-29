import {useEffect} from 'react';
import {BrowserRouter,Routes,Route,Outlet,Navigate,useParams,useLocation} from 'react-router-dom';
import {MotionConfig} from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {Toaster} from 'sonner';
import {WalletProvider,useWallet} from './lib/wallet';
import {WalletDialog} from './components/WalletDialog';
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import {HomePage,BagsPage,EcosystemPage,LeaderboardPage,LaunchPage,NotFoundPage} from './pages/SitePages';
import TokenPage from './pages/TokenPage';
import {BagWorkerPage,GlobalBagPage} from './pages/EcosystemPages';
import './App.css';
import './sections.css';
import './dialogs.css';
import './market.css';
import './trading.css';
import './refinements.css';
import './paper-art.css';

function Layout(){
 const {openWallet}=useWallet();const{pathname,hash}=useLocation();
 useEffect(()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // React Router waits for data-backed anchor destinations to mount.
  const lenis=!reduce&&!pathname.startsWith('/token/')?new Lenis({autoRaf:true,duration:1.05,smoothWheel:true,anchors:false}):null;
  window.scrollTo({top:0,behavior:'instant'});
  let timer,observer,done=false;
  const scrollToHash=()=>{if(!hash||done)return;const target=document.getElementById(hash.slice(1));if(target){done=true;observer?.disconnect();timer=setTimeout(()=>{if(lenis)lenis.scrollTo(target,{offset:-30,immediate:true});else target.scrollIntoView();},100);}};
  if(hash){observer=new MutationObserver(scrollToHash);observer.observe(document.getElementById('main'),{childList:true,subtree:true});scrollToHash();}
  const expiry=setTimeout(()=>observer?.disconnect(),15000);
  return()=>{clearTimeout(timer);clearTimeout(expiry);observer?.disconnect();lenis?.destroy();};
 },[pathname,hash]);
 return <><a href="#main" className="skip-link" data-testid="skip-to-content">Skip to content</a><Header onWallet={openWallet}/><main id="main"><Outlet/></main><Footer compact={pathname.startsWith('/token/')||pathname==='/launch'}/><WalletDialog/><Toaster position="bottom-right" toastOptions={{style:{background:'#faf7f0',color:'#1e1b18',border:'2px solid #1e1b18',boxShadow:'3px 3px 0 #1e1b18',fontFamily:'DM Sans'}}}/></>;
}
const LegacyToken=()=>{const{id}=useParams();return <Navigate to={`/token/${id}`} replace/>;};
export default function App(){return <MotionConfig reducedMotion="user"><BrowserRouter><WalletProvider><Routes><Route element={<Layout/>}><Route path="/" element={<HomePage/>}/><Route path="/bags" element={<BagsPage/>}/><Route path="/token/:id" element={<TokenPage/>}/><Route path="/bags/:id" element={<LegacyToken/>}/><Route path="/launch" element={<LaunchPage/>}/><Route path="/ecosystem" element={<EcosystemPage/>}/><Route path="/leaderboard" element={<LeaderboardPage/>}/><Route path="/bag-worker" element={<BagWorkerPage/>}/><Route path="/global-bag" element={<GlobalBagPage/>}/><Route path="/carry" element={<Navigate to="/bag-worker" replace/>}/><Route path="/paperbag" element={<Navigate to="/global-bag#paperbag" replace/>}/><Route path="*" element={<NotFoundPage/>}/></Route></Routes></WalletProvider></BrowserRouter></MotionConfig>;}