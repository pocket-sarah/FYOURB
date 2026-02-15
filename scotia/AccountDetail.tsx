
import React, { useState } from 'react';
import { BackIcon, InfoIcon, ScotiaLogoSVG, SendIcon, MoveIcon } from './ScotiaIcons';
import TopHeader from './components/TopHeader';
import { generateStatementHTML } from './utils/StatementGenerator';
import { ScotiaAccount } from './types';
import StatementOptionsModal from './components/StatementOptionsModal';
import { AnimatePresence } from 'framer-motion';

interface AccountDetailProps {
  accountName: string;
  data: ScotiaAccount;
  onBack: () => void;
  onDownload: () => void;
  onMobileDeposit: () => void;
  onChat: () => void;
  onETransfer?: () => void;
  onTransfer?: () => void;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ 
  accountName, data, onBack, onDownload, onMobileDeposit, onChat, onETransfer, onTransfer 
}) => {
  const isCredit = data.type === 'credit';
  const label = isCredit ? 'Credit card' : 'Bank account';
  const balanceLabel = isCredit ? 'Current balance' : 'Available balance';
  const [showStatementModal, setShowStatementModal] = useState(false);

  const handleGenerateStatement = (month: number, year: number) => {
    setShowStatementModal(false);
    // Use the actual data object but prompt specific month generation logic
    const html = generateStatementHTML(accountName, data, month, year);
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    } else {
      alert("Please allow popups to view the statement.");
    }
  };

  return (
    <div className="absolute inset-0 z-[200] bg-black flex flex-col animate-in slide-up h-full">
      <TopHeader onBack={onBack} title={label} onChat={onChat} />
      
      <AnimatePresence>
        {showStatementModal && (
            <StatementOptionsModal 
                onGenerate={handleGenerateStatement} 
                onClose={() => setShowStatementModal(false)} 
            />
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
        {/* Red Hero Card */}
        <div className="bg-[#ED0711] pb-16 px-8 pt-6 flex flex-col relative shadow-xl shrink-0">
          <div className="flex items-center gap-1.5 mb-2 opacity-80">
            <span className="text-white text-[10px] font-black uppercase tracking-widest">{balanceLabel}</span>
            <InfoIcon color="white" size={12} />
          </div>
          
          <h3 className="text-white text-5xl font-black tracking-tighter mb-8 drop-shadow-md">
            ${data.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>

          <div className="flex justify-between items-end border-t border-white/20 pt-4">
            <div className="flex flex-col">
              <span className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1">Account No.</span>
              <span className="text-white font-bold text-[14px] tracking-tight">....1029 3847</span>
            </div>
            {!isCredit && (
               <div className="flex flex-col text-right">
                 <span className="text-white/60 text-[9px] font-black uppercase tracking-widest mb-1">Funds on Hold</span>
                 <span className="text-white font-bold text-[14px] tracking-tight">$0.00</span>
               </div>
            )}
          </div>
        </div>

        {/* Action Pills - Floating over the red background */}
        <div className="px-4 -mt-8 relative z-10 grid grid-cols-3 gap-3 mb-6">
            <button 
                onClick={onETransfer}
                className="bg-[#1c1c1e] border border-white/10 rounded-2xl py-4 flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all group"
            >
                <div className="w-10 h-10 rounded-full bg-[#ED0711]/10 flex items-center justify-center text-[#ED0711] mb-2 group-hover:bg-[#ED0711] group-hover:text-white transition-colors">
                    <SendIcon size={18} />
                </div>
                <span className="text-white font-bold text-[10px] uppercase tracking-widest">Send</span>
            </button>

            <button 
                onClick={onTransfer}
                className="bg-[#1c1c1e] border border-white/10 rounded-2xl py-4 flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all group"
            >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <MoveIcon size={18} />
                </div>
                <span className="text-white font-bold text-[10px] uppercase tracking-widest">Move</span>
            </button>

            <button 
                onClick={() => setShowStatementModal(true)}
                className="bg-[#1c1c1e] border border-white/10 rounded-2xl py-4 flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all group"
            >
                <div className="w-10 h-10 rounded-full bg-zinc-700/30 flex items-center justify-center text-zinc-400 mb-2 group-hover:bg-white group-hover:text-black transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <span className="text-white font-bold text-[10px] uppercase tracking-widest">Statements</span>
            </button>
        </div>

        {/* Transactions */}
        <div className="px-4 space-y-4">
          <div className="bg-[#1c1c1e] rounded-[28px] shadow-lg border border-white/5 overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-white/5">
              <h4 className="text-white font-bold text-[11px] uppercase tracking-[0.2em] opacity-60">Posted Transactions</h4>
              <button className="p-2 -mr-2 bg-white/5 rounded-full"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></button>
            </div>
            
            <div className="divide-y divide-white/5">
              {data.history.length > 0 ? (
                data.history.map(tx => (
                  <div key={tx.id} className="p-5 flex justify-between items-start active:bg-white/5 transition-colors">
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center justify-center w-10 pt-1">
                            <span className="text-white font-black text-[14px] leading-none">{tx.date.split(' ')[1]}</span>
                            <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-wider">{tx.date.split(' ')[0]}</span>
                        </div>
                        <div className="flex-1 max-w-[180px]">
                            <p className="text-white font-bold text-[13px] leading-tight uppercase tracking-tight line-clamp-2">{tx.description}</p>
                            <p className="text-zinc-600 text-[10px] font-bold mt-1 uppercase tracking-wider">{tx.category || 'Purchase'}</p>
                        </div>
                    </div>
                    <span className={`font-black text-[15px] tracking-tight ${tx.amount > 0 ? 'text-[#008751]' : 'text-white'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-zinc-700 font-bold uppercase tracking-widest text-[9px]">No Recent Activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
