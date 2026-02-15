import React, { useState } from 'react';
import { BankApp } from '../../types.ts';
// Add Lock to lucide-react imports to avoid collision with global Lock API
import { Search, RotateCw, Home, ChevronLeft, ChevronRight, Share, MoreHorizontal, ShieldCheck, Globe, Lock } from 'lucide-react';
import AppLayout from '../shared/layouts/AppLayout.tsx';

const BrowserApp: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
  const [url, setUrl] = useState('rbos.secure/portal');
  const [isSecure, setIsSecure] = useState(true);

  const portals = [
    { name: 'Scotiabank Online', url: 'scotiabank.com/online', color: 'bg-red-600' },
    { name: 'TD EasyWeb', url: 'td.com/easyweb', color: 'bg-green-700' },
    { name: 'Interac Gateway', url: 'etransfer.interac.ca', color: 'bg-yellow-500' },
    { name: 'Financial Ledger', url: 'rbos.ledger/node-4', color: 'bg-indigo-600' },
    { name: 'DarkForge Matrix', url: 'dfm.void/nexus', color: 'bg-zinc-800' },
    { name: 'Neural Proxy', url: 'np.sarah/stream', color: 'bg-emerald-600' }
  ];

  return (
    <AppLayout brandColor="#ffffff" onClose={onClose} title="Secure Browser">
      <div className="h-full bg-[#f9f9f9] flex flex-col font-sans text-zinc-900">
        {/* URL Bar */}
        <div className="bg-white border-b border-zinc-200 p-4 shrink-0 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-zinc-100 rounded-full py-2 px-4 flex items-center gap-3 border border-transparent focus-within:border-zinc-300 transition-all">
              <ShieldCheck size={14} className="text-emerald-600" />
              <input 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                className="bg-transparent text-sm font-medium outline-none w-full text-zinc-700" 
              />
              <RotateCw size={14} className="text-zinc-400" />
            </div>
            <MoreHorizontal size={20} className="text-zinc-400" />
          </div>
        </div>

        {/* Browser Canvas */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
          {url === 'rbos.secure/portal' ? (
            <div className="p-8 space-y-10 animate-in fade-in">
                <div className="text-center mb-12">
                   <div className="w-20 h-20 bg-indigo-600 rounded-[22%] mx-auto mb-6 flex items-center justify-center shadow-xl shadow-indigo-600/20">
                      <Globe size={40} className="text-white" />
                   </div>
                   <h1 className="text-2xl font-black tracking-tight text-zinc-800">Research Portal</h1>
                   <p className="text-zinc-400 text-sm mt-2 font-medium">Authorized Node: 0x8294-TX</p>
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-2">Secure Gateways</h3>
                   <div className="grid grid-cols-1 gap-3">
                      {portals.map(p => (
                        <button 
                            key={p.url} 
                            onClick={() => setUrl(p.url)}
                            className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
                        >
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center text-white shadow-lg`}>
                                 <Globe size={18} />
                              </div>
                              <div className="text-left">
                                 <p className="font-bold text-zinc-800 text-sm">{p.name}</p>
                                 <p className="text-zinc-400 text-[11px] font-medium">{p.url}</p>
                              </div>
                           </div>
                           <ChevronRight size={18} className="text-zinc-200 group-hover:text-zinc-400 transition-colors" />
                        </button>
                      ))}
                   </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-6 flex gap-4 items-start">
                   <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
                   <div>
                      <p className="text-emerald-900 font-bold text-sm">Hardware VPN Active</p>
                      <p className="text-emerald-700/70 text-xs mt-1 leading-relaxed">Your connection is routed through 4 distinct neural nodes. IP spoofing is nominal.</p>
                   </div>
                </div>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-in slide-up">
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-xl">
                      {/* Fixed: Lock component correctly imported from lucide-react to avoid collision with global Lock API */}
                      <Lock size={40} className="text-zinc-300" />
                  </div>
                  <h2 className="text-xl font-black text-zinc-800 uppercase tracking-tight">Node Access Pending</h2>
                  <p className="text-zinc-400 text-sm mt-4 leading-relaxed font-medium">You are attempting to access a federated research node. Please verify your identity through the banking application to release the lock on:<br/><span className="text-indigo-600 font-bold mt-2 inline-block">{url}</span></p>
                  <button onClick={() => setUrl('rbos.secure/portal')} className="mt-10 px-8 py-3 bg-zinc-900 text-white rounded-full font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all">Go Back</button>
               </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="bg-white border-t border-zinc-200 p-4 pb-10 flex justify-between items-center px-10 shrink-0">
          <button onClick={() => setUrl('rbos.secure/portal')} className="p-2 text-zinc-400 active:text-indigo-600 transition-colors"><ChevronLeft size={24} /></button>
          <button className="p-2 text-zinc-200 cursor-not-allowed"><ChevronRight size={24} /></button>
          <button onClick={() => setUrl('rbos.secure/portal')} className="p-2 text-zinc-400 active:text-indigo-600 transition-colors"><Home size={24} /></button>
          <button className="p-2 text-zinc-400 active:text-indigo-600 transition-colors"><Share size={22} /></button>
          <button className="p-2 text-zinc-400 active:text-indigo-600 transition-colors"><MoreHorizontal size={24} /></button>
        </div>
      </div>
    </AppLayout>
  );
};

export default BrowserApp;