import React, { useState, useEffect } from 'react';
import { ScotiaAccountMap } from '../../scotia/types';
import DashboardView from '../components/DashboardView';
import { SearchIcon, BellIcon, TDLogoSVG } from '../TDIcons';
import { getSystemConfig } from '../../../data/systemConfig';

interface HomeViewProps {
    accounts: ScotiaAccountMap;
    onSelectAccount: (name: string) => void;
    onETransfer: () => void;
    onBillPay: () => void;
    onDeposit: () => void;
    onTransferInternal: () => void;
}

const HomeView: React.FC<HomeViewProps> = (props) => {
    return (
        <div className="flex-1 flex flex-col animate-in fade-in h-full bg-[#f4f7f6]">
            {/* Simplified Header - No Greeting, No Hamburger */}
            <div className="bg-[#008A00] pt-14 pb-12 px-6 shrink-0 relative">
                <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-white/30 flex items-center justify-center overflow-hidden shadow-lg">
                            <TDLogoSVG size={24} />
                        </div>
                        <h2 className="text-white font-bold text-lg tracking-tight">TD Canada Trust</h2>
                    </div>
                    <div className="flex items-center gap-4 text-white">
                        <button className="relative active:scale-90 transition-transform">
                            <BellIcon size={22} />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#008A00]"></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Action Pills */}
            <div className="bg-[#008A00] px-4 pb-10 flex gap-2 shrink-0 overflow-x-auto no-scrollbar">
                <button onClick={props.onDeposit} className="bg-white text-gray-800 px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 whitespace-nowrap shadow-md active:scale-95 transition-transform shrink-0">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
                   Deposit
                </button>
                <button onClick={props.onETransfer} className="bg-white/20 text-white px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 whitespace-nowrap active:scale-95 transition-transform shrink-0">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                   e-Transfer
                </button>
                <button onClick={props.onBillPay} className="bg-white/20 text-white px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 whitespace-nowrap active:scale-95 transition-transform shrink-0">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                   Bills
                </button>
                <button onClick={props.onTransferInternal} className="bg-white/20 text-white px-5 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 whitespace-nowrap active:scale-95 transition-transform shrink-0">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                   Transfer
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32 -mt-6 bg-[#f4f7f6] rounded-t-[32px] relative z-20">
                <DashboardView {...props} />
            </div>
        </div>
    );
};

export default HomeView;