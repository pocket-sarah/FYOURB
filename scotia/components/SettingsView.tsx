import React from 'react';
import { BackIcon, ChevronRightIcon } from '../ScotiaIcons';
import { ScotiaAccountMap } from '../types';
import TopHeader from './TopHeader';

interface SettingsViewProps {
  senderName: string;
  setSenderName: (val: string) => void;
  accounts: ScotiaAccountMap;
  onAdjustBalance: (name: string, val: string) => void;
  onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  senderName, 
  setSenderName, 
  accounts, 
  onAdjustBalance, 
  onBack 
}) => (
  <div className="flex-1 flex flex-col bg-black animate-in slide-up h-full">
    <TopHeader onBack={onBack} title="Settings" />
    
    <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-24 bg-black">
        <div className="bg-zinc-900 rounded-[24px] p-6 border border-white/5 shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#ED0711] flex items-center justify-center text-white font-bold text-xl">
                {senderName[0]}
            </div>
            <div>
                <p className="text-white font-bold text-lg">{senderName}</p>
                <p className="text-zinc-500 text-xs mt-1">Last sign in: Today</p>
            </div>
        </div>

        <div className="space-y-3">
            <h3 className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest px-2">Personal Information</h3>
            <div className="bg-zinc-900 rounded-[20px] overflow-hidden border border-white/5 divide-y divide-white/5">
                <div className="p-5 flex justify-between items-center">
                    <div>
                        <p className="text-white font-bold text-sm">Legal Name</p>
                        <input 
                            type="text" 
                            value={senderName} 
                            onChange={e => setSenderName(e.target.value)} 
                            className="bg-transparent text-zinc-400 text-xs mt-1 outline-none w-full font-medium placeholder-zinc-600"
                            placeholder="Enter Name"
                        />
                    </div>
                    <ChevronRightIcon color="#555" size={14} />
                </div>
                <button className="w-full p-5 flex justify-between items-center text-left active:bg-white/5 transition-all">
                    <div>
                        <p className="text-white font-bold text-sm">Address</p>
                        <p className="text-zinc-500 text-xs mt-1">123 Jasper Ave, Edmonton AB</p>
                    </div>
                    <ChevronRightIcon color="#555" size={14} />
                </button>
            </div>
        </div>

        <div className="space-y-3">
            <h3 className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest px-2">Account Management</h3>
            <div className="bg-zinc-900 rounded-[20px] overflow-hidden border border-white/5 divide-y divide-white/5">
                {Object.keys(accounts).map(name => (
                    <div key={name} className="p-5 flex justify-between items-center border-t border-white/5 bg-zinc-900/50">
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm">{name}</p>
                            <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mt-1">Display Balance</p>
                        </div>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={accounts[name].balance} 
                            onChange={e => onAdjustBalance(name, e.target.value)} 
                            className="bg-transparent text-white font-bold text-right outline-none w-24 focus:border-b focus:border-[#ED0711]" 
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
  </div>
);

export default SettingsView;