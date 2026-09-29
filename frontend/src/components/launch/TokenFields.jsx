import {useRef,useState} from 'react';
import {Upload,ImagePlus,Users,Flame} from 'lucide-react';
import {api,API,errorText} from '../../lib/api';
import {toast} from 'sonner';

export const TokenFields=({form,change,setUploading})=>{
 const fileInput=useRef(null);const [uploadBusy,setUploadBusy]=useState(false);
 const upload=async e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){toast.error('Choose a PNG, JPG, or WebP smaller than 5 MB.');e.target.value='';return;}
  setUploadBusy(true);setUploading(true);const data=new FormData();data.append('file',file);
  try{const r=await api.post('/uploads',data,{timeout:120000});change('image_id',r.data.id);toast.success('Artwork added.');}catch(err){toast.error(errorText(err));}finally{setUploadBusy(false);setUploading(false);e.target.value='';}
 };
 return <>
  <div className="form-section-heading"><span>01</span><h2 data-testid="launch-token-section-title">Give your idea a name.</h2></div>
  <div className="two-fields"><label className="field" htmlFor="launch-name">Token name<input id="launch-name" data-testid="launch-name" value={form.name} onChange={e=>change('name',e.target.value)} placeholder="Something worth holding" maxLength={32} required pattern=".*\S.*"/></label><label className="field" htmlFor="launch-ticker">Ticker<input id="launch-ticker" data-testid="launch-ticker" value={form.ticker} onChange={e=>change('ticker',e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))} placeholder="BAG" maxLength={10} pattern="[A-Z0-9]{1,10}" required/></label></div>
  <label className="field" htmlFor="launch-token-description">The story<textarea id="launch-token-description" data-testid="launch-token-description" value={form.description} onChange={e=>change('description',e.target.value)} rows={3} maxLength={500} placeholder="What's the idea behind your token?" required/></label>
  <input type="file" accept="image/png,image/jpeg,image/webp" ref={fileInput} onChange={upload} className="sr-only" aria-label="Token artwork" data-testid="launch-image-input"/>
  <button type="button" className="upload-zone" onClick={()=>fileInput.current?.click()} disabled={uploadBusy} data-testid="launch-image-upload">{form.image_id?<img src={`${API}/files/${form.image_id}`} alt="Your uploaded token artwork"/>:<ImagePlus size={30} strokeWidth={1.3}/>}<span>{uploadBusy?'Adding your artwork…':form.image_id?'Nice artwork. Tap to replace.':'A little personality goes a long way.'}<small>Optional artwork · PNG, JPG, WebP · up to 5 MB</small></span><Upload size={17}/></button>
  <details className="social-fields"><summary data-testid="launch-socials-toggle">Leave a paper trail <span>Social links +</span></summary>{[['website','Website','https://your-project.com'],['twitter','X / Twitter','https://x.com/your-project'],['telegram','Telegram','https://t.me/your-project']].map(([key,label,placeholder])=><label className="field" htmlFor={`launch-${key}`} key={key}>{label}<input id={`launch-${key}`} data-testid={`launch-${key}`} type="url" pattern="https://.*" maxLength={250} placeholder={placeholder} value={form[key]} onChange={e=>change(key,e.target.value)}/></label>)}</details>
 </>;
};

export const BagFields=({form,change})=> <>
 <div className="form-section-heading"><span>02</span><h2 data-testid="launch-bag-section-title">Pack your Bag.</h2></div>
 <div className="two-fields"><label className="field" htmlFor="launch-target-sol">Bag target (SOL)<input id="launch-target-sol" data-testid="launch-target_sol" type="number" required min="0.000001" max="1000000" step="any" value={form.target_sol} onChange={e=>change('target_sol',e.target.value)}/></label><label className="field" htmlFor="launch-asset">Fill asset<select id="launch-asset" data-testid="launch-fill-asset" value={form.asset} onChange={e=>change('asset',e.target.value)}>{['SOL','USDC','DOGE','SHIB','BONK'].map(a=><option key={a}>{a}</option>)}</select></label></div>
 <div className="mode-options" role="group" aria-label="Bag mode">{[[Users,'SHARE','Share the good stuff with holders.'],[Flame,'BURN','Buy back and burn your token.']].map(([Icon,mode,copy])=><button type="button" key={mode} data-testid={`launch-mode-${mode.toLowerCase()}`} aria-pressed={form.mode===mode} className={form.mode===mode?'selected':''} onClick={()=>change('mode',mode)}><span><Icon size={18}/>{mode}</span><small>{copy}</small></button>)}</div>
 <label className="field" htmlFor="launch-global-asset">Global Bag contribution<select id="launch-global-asset" data-testid="launch-global-asset" value={form.global_asset} onChange={e=>change('global_asset',e.target.value)}>{['SOL','USDC','DOGE','SHIB','BONK'].map(a=><option key={a}>{a}</option>)}</select></label>
 <p className="field-note" data-testid="launch-pair-explanation">Your token's simulated pair is {form.ticker||'TOKEN'}/SOL. The Fill Asset is for the Bag, not the trading pair.</p>
</>;