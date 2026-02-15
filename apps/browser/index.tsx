import React, { useState } from 'react';
import { BankApp } from '../../types';

interface BrowserAppProps {
  app: BankApp;
  onClose: () => void;
  onNotify: (title: string, message: string, icon: string) => void;
}

const BrowserApp: React.FC<BrowserAppProps> = ({ onClose }) => {
  const [url, setUrl] = useState('google.com');

  return (
    <div className="absolute inset-0 bg-white flex flex-col z-[100] animate-in slide-up overflow-hidden text-black">
      <header className="pt-14 px-4 pb-4 bg-zinc-100 flex items-center gap-3 shrink-0">
        <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <div className="flex-1 bg-white rounded-full px-5 py-2.5 flex items-center gap-3 border border-zinc-200">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
           <input 
             type="text" 
             value={url}
             onChange={e => setUrl(e.target.value)}
             className="bg-transparent border-none outline-none text-sm font-medium w-full"
           />
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-md">G</div>
      </header>

      <div className="flex-1 bg-zinc-50 flex flex-col items-center justify-center p-12 text-center">
         <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt="Google" className="w-48 mb-10" />
         <div className="w-full max-w-md relative mb-12">
            <input 
              type="text" 
              placeholder="Search or type URL" 
              className="w-full py-4 px-12 rounded-full shadow-xl border border-zinc-100 bg-white outline-none"
            />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" className="absolute left-5 top-1/2 -translate-y-1/2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
         </div>
         <div className="grid grid-cols-4 gap-8 w-full max-w-sm">
            {['YouTube', 'News', 'Gmail', 'Photos'].map(t => (
               <div key={t} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center font-bold text-zinc-400">?</div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t}</span>
               </div>
            ))}
         </div>
      </div>

      <nav className="h-16 border-t border-zinc-100 bg-zinc-50 flex items-center justify-around px-10 pb-4">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3"><path d="m9 18 6-6-6-6" className="rotate-180 origin-center"/></svg>
         <div className="w-6 h-6 rounded-md border-2 border-zinc-300"></div>
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="3"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
      </nav>
    </div>
  );
};

export default BrowserApp;