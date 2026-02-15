import React, { useState } from 'react';
import { BackIcon, InfoIcon, TDLogoSVG } from '../TDIcons';
import { ScotiaAccount } from '../../scotia/types';
import { generateTDStatementHTML } from '../utils/TDStatementGenerator';
import TDStatementOptionsModal from './TDStatementOptionsModal';
import { AnimatePresence } from 'framer-motion';

interface AccountDetailProps {
  accountName: string;
  data: ScotiaAccount;
  onBack: () => void;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ accountName, data, onBack }) => {
  const [showStatementModal, setShowStatementModal] = useState(false);

  const handleGenerateStatement = (month: number, year: number) => {
    setShowStatementModal(false);
    const html = generateTDStatementHTML(accountName, data, month, year);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    } else {
      alert("Please allow popups to view the statement.");
    }
  };

  return (
    <div className="absolute inset-0 bg-[#F3F3F3] z-[500] flex flex-col animate-in slide-up h-full overflow-hidden font-sans">
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
                <h1 className="text-5xl font-black tracking-tighter mb-8">${data.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h1>
                
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

        {/* Action Pills Section */}
        <div className="px-6 -mt-6 relative z-30 grid grid-cols-3 gap-3">
            <button className="bg-white rounded-xl py-4 flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-[#008A00] mb-1.5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </div>
                <span className="text-gray-900 font-bold text-[10px] uppercase tracking-wider">Send</span>
            </button>
            <button className="bg-white rounded-xl py-4 flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1.5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m7 16-4-4 4-4m10 8 4-4-4-4m-14 4h18"/></svg>
                </div>
                <span className="text-gray-900 font-bold text-[10px] uppercase tracking-wider">Move</span>
            </button>
            <button 
                onClick={() => setShowStatementModal(true)}
                className="bg-white rounded-xl py-4 flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all border border-gray-100"
            >
                <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 mb-1.5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <span className="text-gray-900 font-bold text-[10px] uppercase tracking-wider">Statements</span>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-10 bg-[#F3F3F3] relative z-20 pt-8">
            <div className="bg-white shadow-xl shadow-black/[0.02] border-y border-gray-100">
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
        </div>

        <AnimatePresence>
            {showStatementModal && (
                <TDStatementOptionsModal 
                    onGenerate={handleGenerateStatement} 
                    onClose={() => setShowStatementModal(false)} 
                />
            )}
        </AnimatePresence>
    </div>
  );
};

export default AccountDetail;