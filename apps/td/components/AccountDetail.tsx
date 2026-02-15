import React from 'react';
import { BackIcon, InfoIcon, TDLogoSVG } from '../TDIcons';
import { ScotiaAccount } from '../../scotia/types';

interface AccountDetailProps {
  accountName: string;
  data: ScotiaAccount;
  onBack: () => void;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ accountName, data, onBack }) => {
  return (
    <div className="absolute inset-0 bg-[#F3F3F3] z-[500] flex flex-col animate-in slide-up h-full overflow-hidden font-sans text-[#333]">
        {/* Dynamic Header - Match Collage */}
        <div className="bg-gradient-to-b from-[#008A00] to-[#54B948] pt-14 pb-12 px-6 shadow-lg shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="flex justify-between items-center mb-10 relative z-10">
                <button onClick={onBack} className="text-white active:scale-90 transition-transform p-2 -ml-2">
                    <BackIcon color="white" />
                </button>
                <TDLogoSVG size={32} />
                <div className="w-10"></div>
            </div>
            
            <div className="text-white relative z-10">
                <p className="text-white/70 text-[11px] font-bold uppercase tracking-[0.15em] mb-1.5">Available Balance</p>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-8">${data.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h1>
                
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Total Balance</p>
                        <p className="text-white font-black text-[18px] tracking-tight">${(data.balance + (data.pending || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                    {data.points > 0 && (
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-2.5 border border-white/10">
                            <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mb-0.5">TD Rewards</p>
                            <p className="text-white font-black text-[15px] tracking-tight">{data.points.toLocaleString()} PTS</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-10 -mt-6 rounded-t-[32px] bg-[#F3F3F3] relative z-20">
            <div className="bg-white shadow-xl shadow-black/[0.02] border-y border-gray-100 mt-6">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-black text-gray-400 text-[11px] uppercase tracking-[0.25em]">Recent Activity</h3>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                        <InfoIcon size={14} color="#008A00" />
                    </div>
                </div>
                <div className="divide-y divide-gray-50">
                    {data.history.length > 0 ? (
                        data.history.map(tx => (
                            <div key={tx.id} className="p-6 flex justify-between items-start active:bg-gray-50 transition-colors">
                                <div className="max-w-[70%]">
                                    <p className="font-bold text-gray-800 text-[15px] leading-tight tracking-tight uppercase">{tx.description}</p>
                                    <p className="text-gray-400 text-[11px] font-bold mt-1.5 uppercase tracking-widest">{tx.date} • {tx.status || 'Posted'}</p>
                                </div>
                                <span className={`font-black text-[17px] tracking-tight text-right ${tx.amount > 0 ? 'text-[#008A00]' : 'text-gray-900'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center flex flex-col items-center gap-4 opacity-20">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="10"/></svg>
                            <p className="text-[11px] font-black uppercase tracking-[0.3em]">No Transactions Found</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Quick Link Card */}
            <div className="px-6 mt-8">
                <button className="w-full bg-white border border-gray-200 p-8 rounded-[32px] flex flex-col items-center gap-4 group active:bg-gray-50 transition-all shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-[#008A00] flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                    <span className="font-black text-[#008A00] text-[13px] uppercase tracking-[0.2em]">Move Money</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default AccountDetail;