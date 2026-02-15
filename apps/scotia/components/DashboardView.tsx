
import React from 'react';
import { ChevronRightIcon, SearchIcon, InfoIcon } from '../ScotiaIcons';
import { ScotiaAccountMap, ScotiaAccount } from '../types';
import TopHeader from './TopHeader';

interface DashboardViewProps {
  accounts: ScotiaAccountMap;
  onSelectAccount: (name: string) => void;
  onMobileDeposit: () => void;
  onETransferHub: () => void; // Changed from onETransfer to onETransferHub
  onChat: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ accounts, onSelectAccount, onMobileDeposit, onETransferHub, onChat }) => {
  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden h-full">
      <TopHeader title="Move money" onChat={onChat} />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 pt-6">
        {/* Quick Actions */}
        <div className="px-6 pb-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.15em]">Quick actions</span>
                    <InfoIcon size={14} color="#333" />
                </div>
                <button className="text-[#0071EB] font-bold text-[13px] active:opacity-60 transition-opacity">Hide actions</button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
                <div className="w-[210px] shrink-0 bg-[#1c1c1e] border border-white/5 rounded-[20px] shadow-2xl flex flex-col relative overflow-hidden group">
                    <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center active:bg-white/10 transition-colors z-10">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                    <div className="p-5 flex-1">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Interac</p>
                        <p className="text-white font-bold text-[16px] leading-tight mb-5 line-clamp-2">Abagail June Carruthers</p>
                        <p className="text-zinc-500 text-[12px] font-medium">Last sent: <span className="text-zinc-400 font-bold">Jul 27</span></p>
                    </div>
                    <button onClick={onETransferHub} className="w-full py-4 border-t border-white/5 text-[#3b82f6] font-black text-[14px] active:bg-white/5 transition-all uppercase tracking-wider">Send</button>
                </div>

                <div className="w-[210px] shrink-0 bg-[#1c1c1e] border border-white/5 rounded-[20px] shadow-2xl flex flex-col relative overflow-hidden group">
                    <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center active:bg-white/10 transition-colors z-10">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                    <div className="p-5 flex-1">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Pay bills</p>
                        <p className="text-white font-bold text-[16px] leading-tight mb-5 line-clamp-2">Rogers communications</p>
                        <p className="text-zinc-500 text-[12px] font-medium">Last paid: <span className="text-zinc-400 font-bold">Jul 27</span></p>
                    </div>
                    <button className="w-full py-4 border-t border-white/5 text-[#3b82f6] font-black text-[14px] active:bg-white/5 transition-all uppercase tracking-wider">Pay</button>
                </div>
            </div>
        </div>

        <div className="h-[10px] bg-[#0c0c0e] w-full border-y border-white/5"></div>

        {/* Payments and Transfers List */}
        <div className="px-6 py-8 bg-black">
            <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-10 px-1">Payments and transfers</h3>
            
            <div className="space-y-12">
                <button className="w-full flex items-center gap-6 group active:opacity-60 transition-all text-left">
                    <div className="w-14 h-14 bg-[#1c1c1e] rounded-2xl flex items-center justify-center border border-white/10 shadow-xl group-active:scale-95 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-bold text-[16px] tracking-tight">Pay bills</p>
                        <p className="text-zinc-500 text-[13px] font-medium mt-1">Pay bills easily from anywhere</p>
                    </div>
                    <ChevronRightIcon color="#3b82f6" size={20} />
                </button>

                <button className="w-full flex items-center gap-6 group active:opacity-60 transition-all text-left">
                    <div className="w-14 h-14 bg-[#1c1c1e] rounded-2xl flex items-center justify-center border border-white/10 shadow-xl group-active:scale-95 transition-transform">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M17 3l4 4-4 4"/><path d="M3 7h18"/><path d="M7 21l-4-4 4-4"/><path d="M21 17H3"/></svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-bold text-[16px] tracking-tight">Transfer between accounts</p>
                        <p className="text-zinc-500 text-[13px] font-medium mt-1">Pay your credit card or transfer funds</p>
                    </div>
                    <ChevronRightIcon color="#3b82f6" size={20} />
                </button>

                <button onClick={onETransferHub} className="w-full flex items-center gap-6 group active:opacity-60 transition-all text-left">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center relative border border-white/10 shadow-xl group-active:scale-95 transition-transform overflow-hidden">
                        <div className="absolute inset-0 bg-[#FFCC00] opacity-10"></div>
                        <div className="w-11 h-11 bg-[#FFCC00] rounded-lg flex items-center justify-center text-[8px] font-black text-black shadow-inner">INTERAC</div>
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-bold text-[16px] tracking-tight">Interac e-transfer</p>
                        <p className="text-zinc-500 text-[13px] font-medium mt-1">Transfer money: received in 30 mins or less</p>
                    </div>
                    <ChevronRightIcon color="#3b82f6" size={20} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;