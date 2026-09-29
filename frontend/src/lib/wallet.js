import {createContext,useContext,useState} from 'react';
import {useSimulation} from './simulation';
const WalletContext=createContext(null);
const KEY='paperbag-demo-wallet';

export const WalletProvider=({children})=>{
 const practice=useSimulation();
 const [provider,setProvider]=useState(()=>{const p=localStorage.getItem(KEY);return ['Phantom','Solflare'].includes(p)?p:null;});
 const [open,setOpen]=useState(false);
 const connect=name=>{if(!practice.simulation)return false;setProvider(name);localStorage.setItem(KEY,name);setOpen(false);return true;};
 const disconnect=()=>{setProvider(null);localStorage.removeItem(KEY);setOpen(false);};
 const address=practice.simulation?`DEMO-${practice.simulation.id.slice(0,4)}…${practice.simulation.id.slice(-4)}`:'DEMO';
 return <WalletContext.Provider value={{provider,connected:!!provider,address,practice,open,setOpen,openWallet:()=>setOpen(true),connect,disconnect}}>{children}</WalletContext.Provider>;
};
export const useWallet=()=>useContext(WalletContext);