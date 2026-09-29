import {useRef,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {ArrowUpRight,Wallet,ArrowRight,Check,LoaderCircle} from 'lucide-react';
import {toast} from 'sonner';
import {api,API,errorText} from '../lib/api';
import {useWallet} from '../lib/wallet';
import {BagArt} from './BagArt';
import {TokenFields,BagFields} from './launch/TokenFields';
const initial={name:'',ticker:'',description:'',image_id:null,website:'',twitter:'',telegram:'',target_sol:10,asset:'SOL',global_asset:'SOL',mode:'SHARE'};

export const LaunchFlow=()=>{
 const navigate=useNavigate();const {connected,provider,address,practice,openWallet}=useWallet();
 const [form,setForm]=useState(initial),[busy,setBusy]=useState(false),[uploading,setUploading]=useState(false),[error,setError]=useState('');
 const request=useRef(null);const submitting=useRef(false);
 const change=(key,value)=>{setForm(f=>({...f,[key]:value}));setError('');request.current=null;};
 const deploy=async e=>{
  e.preventDefault();if(submitting.current||uploading)return;
  if(!connected||!practice.simulation){openWallet();return;}
  if(!form.name.trim()||!form.description.trim()){setError('Give your token a name and a story.');return;}
  submitting.current=true;setBusy(true);setError('');request.current??=crypto.randomUUID();
  try{
   const r=await api.post('/launch',{...form,target_sol:Number(form.target_sol),simulation_id:practice.simulation.id,wallet_provider:provider,request_id:request.current});
   toast.success(`$${r.data.ticker} is on the board!`);navigate(`/token/${r.data.id}?launched=1`);
  }catch(err){setError(errorText(err));}finally{submitting.current=false;setBusy(false);}
 };
 return <div className="launch-workbench" data-testid="launch-workbench">
  <form className="launch-paper-form" onSubmit={deploy} data-testid="launch-token-form">
   <div className="paper-sheet-caption"><span>THE TOKEN SPECIFICATION</span><span>No. 001 / SOLANA EDITION</span></div>
   <div className={`launch-wallet-status ${connected?'is-connected':''}`} data-testid="launch-wallet-status"><Wallet size={21}/><div><strong>{connected?`${provider} connected`:'A pocket for your new token.'}</strong><small>{connected?`${address} · demo wallet`:'Connect a demo wallet to get started.'}</small></div><button className="text-link" type="button" onClick={openWallet} data-testid="launch-connect-wallet">{connected?'Manage':'Connect'} <ArrowUpRight size={14}/></button></div>
   <fieldset disabled={busy} className="launch-fields"><TokenFields form={form} change={change} setUploading={setUploading}/><BagFields form={form} change={change}/></fieldset>
   {error&&<div className="deploy-error" role="alert" data-testid="deploy-error">{error}</div>}
   <div className="deploy-bottom"><div className="deploy-notice" data-testid="deploy-notice"><Check size={15}/><span>Deploy → listed in Bags → ready for practice trading.</span></div>{connected?<button type="submit" className="button primary full deploy-token-button" disabled={busy||uploading||practice.initializing} data-testid="deploy-token-button">{busy?<><LoaderCircle className="spin-icon" size={18}/> Deploying your token…</>:<>Deploy token <ArrowUpRight size={20}/></>}</button>:<button type="button" className="button primary full deploy-token-button" onClick={openWallet} data-testid="deploy-connect-wallet"><Wallet size={18}/> Connect wallet to deploy</button>}<small data-testid="launch-simulation-disclosure">Demo deployment. Your token is published here, not on the blockchain. No fees or real funds.</small></div>
  </form>
  <aside className="launch-specimen" data-testid="launch-preview"><span className="hand-note specimen-callout">your next big thing ↓</span><div className="token-specimen"><span className="specimen-label">FRESH OFF THE PAPER PRESS</span><div className="specimen-image">{form.image_id?<img src={`${API}/files/${form.image_id}`} alt="Token preview" data-testid="launch-preview-image"/>:<BagArt progress={0} animate/>}</div><h2 data-testid="launch-preview-name">{form.name||'An idea worth holding.'}</h2><span className="specimen-ticker" data-testid="launch-preview-ticker">${form.ticker||'YOURTOKEN'}</span><p data-testid="launch-preview-description">{form.description||'A name, a story, and a Bag. The rest starts here.'}</p><dl data-testid="launch-preview-settings"><div><dt>Bag target</dt><dd>{form.target_sol||'0'} SOL</dd></div><div><dt>Fill asset</dt><dd>{form.asset}</dd></div><div><dt>Bag mode</dt><dd>{form.mode}</dd></div><div><dt>Bag Worker</dt><dd>Assigned on launch <Check size={12}/></dd></div></dl></div><img className="launch-workshop-art" src="/images/paper-worker.png" alt="Hand-drawn paper workshop"/><Link to="/bags" className="text-link" data-testid="launch-browse-link">Take a look around first <ArrowRight size={15}/></Link></aside>
 </div>;
};