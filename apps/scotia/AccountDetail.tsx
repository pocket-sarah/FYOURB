
import React, { useState } from 'react';
import { BackIcon, InfoIcon, ChevronRightIcon, ScotiaLogoSVG } from './ScotiaIcons';
import StatementView from './components/StatementView';
import TopHeader from './components/TopHeader';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status?: string;
}

interface AccountDetailProps {
  accountName: string;
  data: { balance: number, points: number, pending?: number, available?: number, type: string, history: Transaction[] };
  onBack: () => void;
  onDownload: () => void;
  onMobileDeposit: () => void;
  onChat: () => void;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ accountName, data, onBack, onDownload, onMobileDeposit, onChat }) => {
  const [showStatement, setShowStatement] = useState(false);
  const isCredit = data.type === 'credit';
  const label = isCredit ? 'Credit card' : 'Bank account';
  const balanceLabel = isCredit ? 'Current balance' : 'Available balance';

  return (
    <div className="absolute inset-0 z-[200] bg-black flex flex-col animate-in slide-up overflow-y-auto no-scrollbar pb-12 h-full">
      {showStatement && <StatementView accountName={accountName} account={data as any} onClose={() => setShowStatement(false)} />}
      
      <TopHeader onBack={onBack} title={label} onChat={onChat} />

      <div className="bg-[#ED0711] pb-12 px-8 flex flex-col relative shadow-xl shrink-0 -mt-10">
        <div className="flex items-center gap-1.5 mb-2 opacity-70 mt-6">
          <span className="text-white text-[10px] font-black uppercase tracking-widest">{balanceLabel}</span>
          <InfoIcon color="white" size={10} />
        </div>
        
        <h3 className="text-white text-4xl font-black tracking-tighter mb-10 drop-shadow-md">
          ${data.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Pending</span>
            <span className="text-white font-black text-[16px] tracking-tight">${(data.pending || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">{isCredit ? 'Available credit' : 'Total balance'}</span>
            <span className="text-white font-black text-[16px] tracking-tight">${(data.available || data.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-3 -mt-4 relative z-30 pb-10">
        {!isCredit && (
          <button onClick={onMobileDeposit} className="w-full bg-[#121212] rounded-[24px] p-4 flex items-center justify-between shadow-xl border border-white/5 active:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#ED0711]/10 text-[#ED0711]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <div className="text-left">
                 <p className="text-white font-bold text-[13px]">Deposit a Cheque</p>
                 <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Mobile Deposit</p>
              </div>
            </div>
            <ChevronRightIcon color="#ED0711" size={14} />
          </button>
        )}

        <button onClick={() => setShowStatement(true)} className="w-full bg-[#121212] rounded-[24px] p-4 flex items-center justify-between shadow-xl border border-white/5 active:bg-white/10 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#ED0711]/10 text-[#ED0711]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div className="text-left">
               <p className="text-white font-bold text-[13px]">View Statement</p>
               <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Oct 2024 (PDF)</p>
            </div>
          </div>
          <ChevronRightIcon color="#ED0711" size={14} />
        </button>

        <div className="bg-[#121212] rounded-[28px] shadow-xl border border-white/5 overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-white/5">
            <h4 className="text-white font-bold text-[11px] uppercase tracking-[0.2em] opacity-60">Recent Activity</h4>
            <InfoIcon color="#444" size={14} />
          </div>
          <div className="divide-y divide-white/5">
            {data.history.length > 0 ? (
              data.history.map(tx => (
                <div key={tx.id} className="p-4 flex justify-between items-center active:bg-white/5 transition-colors">
                  <div className="text-left max-w-[70%]">
                    <p className="text-white font-bold text-[12px] truncate uppercase tracking-tight">{tx.description}</p>
                    <p className="text-zinc-600 text-[10px] font-bold mt-0.5 uppercase tracking-tighter">{tx.date} {tx.status && `• ${tx.status}`}</p>
                  </div>
                  <span className={`font-black text-[13px] tracking-tight ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-zinc-700 font-bold uppercase tracking-widest text-[9px]">No Activity Record</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
