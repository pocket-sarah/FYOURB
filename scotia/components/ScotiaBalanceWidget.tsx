import React, { useState, useMemo } from 'react';
import { ScotiaLogoSVG, ChevronDownIcon, SendIcon } from '../ScotiaIcons';
import { ScotiaAccountMap, ScotiaAccount, PendingTransfer } from '../types';

interface ScotiaBalanceWidgetProps {
    accounts: ScotiaAccountMap;
    onOpenApp: (accountId?: string) => void;
}

const ScotiaBalanceWidget: React.FC<ScotiaBalanceWidgetProps> = ({ accounts, onOpenApp }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const bankingEntries = useMemo(() => 
        (Object.entries(accounts) as [string, ScotiaAccount][]).filter(([_, acc]) => acc.type === 'banking'),
        [accounts]
    );

    const totalBalance = useMemo(() => 
        bankingEntries.reduce((sum, [_, acc]) => sum + acc.balance, 0),
        [bankingEntries]
    );

    const recentTransfer = useMemo(() => {
        const saved = localStorage.getItem('scotia_pending_transfers');
        if (saved) {
            try {
                const transfers: PendingTransfer[] = JSON.parse(saved);
                return transfers[0]; // Most recent from the array
            } catch (e) {
                return null;
            }
        }
        return null;
    }, [isExpanded]);

    const handleExpandToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
        if (navigator.vibrate) navigator.vibrate(10);
    };

    return (
        <div 
            onClick={() => !isExpanded ? setIsExpanded(true) : onOpenApp()}
            className={`w-full bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[32px] p-6 widget-shadow active:scale-[0.99] transition-all duration-500 cursor-pointer overflow-hidden group relative ${isExpanded ? 'ring-1 ring-[#ED0711]/20 shadow-[#ED0711]/5' : ''}`}
        >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ED0711]/5 rounded-bl-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#ED0711]/10 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    {/* Pure white logo, no background container */}
                    <div className="w-8 h-8 flex items-center justify-center">
                        <ScotiaLogoSVG color="white" className="w-full h-full" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-white/80 text-[11px] font-black uppercase tracking-[0.2em]">Scotiabank®</span>
                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest -mt-0.5">Asset View</span>
                    </div>
                </div>
                <button 
                    onClick={handleExpandToggle}
                    className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}
                >
                    <ChevronDownIcon color="white" size={16} />
                </button>
            </div>

            {!isExpanded ? (
                <div className="flex flex-col items-center py-6 relative z-10 animate-in fade-in">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse"></div>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Data</p>
                    </div>
                    <p className="text-white/70 text-[13px] font-medium">Tap to reveal balances</p>
                </div>
            ) : (
                <div className="space-y-6 relative z-10 animate-in slide-up duration-300">
                    <div className="text-right pb-4 border-b border-white/10">
                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Total Assets</p>
                        <p className="text-white font-black text-3xl tracking-tighter">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] px-1">My Accounts</p>
                        {bankingEntries.map(([name, acc]) => (
                            <div 
                                key={name} 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    onOpenApp(name); 
                                }}
                                className="flex justify-between items-center p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 active:scale-95 transition-all group/acc"
                            >
                                <div className="flex flex-col">
                                    <span className="text-white/90 text-[13px] font-bold truncate pr-4 group-hover/acc:text-white transition-colors">{name}</span>
                                    <span className="text-white/30 text-[9px] uppercase font-bold tracking-tighter">....1035</span>
                                </div>
                                <span className="text-white font-black text-[15px] tracking-tight">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                    </div>

                    {recentTransfer && (
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] px-1 mb-3">Recent activity</p>
                            <div className="flex items-center gap-4 bg-[#ED0711]/5 p-4 rounded-2xl border border-[#ED0711]/10">
                                <div className="w-10 h-10 rounded-full bg-[#ED0711]/20 flex items-center justify-center text-[#ED0711]">
                                    <SendIcon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-[13px] truncate">{recentTransfer.recipientName}</p>
                                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tight">{recentTransfer.date} • {recentTransfer.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-black text-[13px]">-${recentTransfer.amount.toFixed(2)}</p>
                                    <p className="text-white/20 text-[9px] font-bold">Interac®</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="pt-2 flex justify-center">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onOpenApp(); }}
                            className="bg-white/5 px-6 py-2 rounded-full text-white/50 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all"
                        >
                            Open EasyWeb
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScotiaBalanceWidget;