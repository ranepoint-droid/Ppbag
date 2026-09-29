import {Ghost,Sun,Wallet,LogOut,Copy,ArrowUpRight} from 'lucide-react';
import {toast} from 'sonner';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from './ui/dialog';
import {useWallet} from '../lib/wallet';
import {amount} from '../lib/api';

export const WalletDialog=()=>{
 const {open,setOpen,provider,connected,address,practice,connect,disconnect}=useWallet();
 const copy=async()=>{try{await navigator.clipboard.writeText(address);toast.success('Demo wallet label copied.');}catch{toast.error('Could not copy the wallet label.');}};
 return <Dialog open={open} onOpenChange={setOpen}><DialogContent className="paper-dialog wallet-dialog sketch-wallet" data-testid="wallet-dialog" data-lenis-prevent>
  <span className="paper-tab" data-testid="wallet-mode-badge">DEMO WALLET / NO REAL FUNDS</span>
  <div className="wallet-doodle"><Wallet size={39} strokeWidth={1.4}/></div>
  <DialogTitle data-testid="wallet-modal-heading">{connected?'Your pocket, unpacked.':'Pick your pocket.'}</DialogTitle>
  <DialogDescription data-testid="wallet-modal-copy">{connected?'Your demo wallet is connected to the Paperbag workshop.':'Connect a demo wallet to launch a token. No extension, signature, or real funds needed.'}</DialogDescription>
  {connected?<>
   <div className="wallet-connected-note" data-testid="wallet-connected-state"><span>{provider} <small>MOCKUP</small></span><strong>{address}</strong><button className="icon-button" title="Copy demo label" aria-label="Copy demo wallet label" onClick={copy} data-testid="wallet-copy"><Copy size={16}/></button></div>
   <div className="wallet-funds" data-testid="wallet-demo-balance"><span>Virtual balance</span><strong>{amount(practice.simulation?.balance_sol||0)} SOL</strong></div>
   <button className="button full" onClick={disconnect} data-testid="wallet-disconnect"><LogOut size={16}/> Disconnect demo wallet</button>
   <small className="wallet-footnote" data-testid="wallet-persistence-note">Your practice positions stay in this browser.</small>
  </>:<div className="wallet-provider-list">{[[Ghost,'Phantom','A friendly little pocket.'],[Sun,'Solflare','A little sunshine for your Bag.']].map(([Icon,name,copy])=><button key={name} className="wallet-provider" disabled={practice.initializing||!practice.simulation} onClick={()=>{if(connect(name))toast.success(`${name} demo wallet connected.`);}} data-testid={`wallet-connect-${name.toLowerCase()}`}><Icon size={28} strokeWidth={1.5}/><span><strong>{name}</strong><small>{copy}</small></span><ArrowUpRight size={20}/></button>)}</div>}
  {practice.initializing&&<p className="wallet-footnote" role="status" data-testid="wallet-loading">Opening your demo balance…</p>}
  {practice.simError&&<div className="trade-error" data-testid="wallet-error">Couldn't open the demo balance.<button className="text-link" onClick={practice.onRetry} data-testid="wallet-retry">Try again</button></div>}
 </DialogContent></Dialog>;
};