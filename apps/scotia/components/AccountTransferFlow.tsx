
import React, { useState } from 'react';
import { BackIcon, ChevronRightIcon, SendIcon } from '../ScotiaIcons';
import { ScotiaAccountMap, ScotiaAccount } from '../types';

interface AccountTransferFlowProps {
  accounts: ScotiaAccountMap;
  onClose: () => void;
  onComplete: (type: 'internal', amount: number, payload: any) => void;
}

const AccountTransferFlow: React.FC<AccountTransferFlowProps> = ({ accounts, onClose, onComplete }) => {
  const [step, setStep] = useState<'from' | 'to' | 'amount' | 'confirm'>('from');
  const [fromAccount, setFromAccount] = useState<string | null>(null);
  const [toAccount, setToAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  // Fix: Explicitly cast Object.entries(accounts) to fix 'unknown' property error
  // Only allow banking accounts to be the source
  const sourceAccounts = (Object.entries(accounts) as [string, ScotiaAccount][]).filter(([_, d]) => d.type === 'banking');
  // Allow any other account to be the destination
  const targetAccounts = (Object.entries(accounts) as [string, ScotiaAccount][]).filter(([name, _]) => name !== fromAccount);

  const handleComplete = () => {
    onComplete('internal', parseFloat(amount), { from: fromAccount, to: toAccount });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[260] bg-black flex flex-col animate-in slide-up h-full overflow-hidden">
      <div className="pt-12 pb-4 px-6 flex items-center justify-between border-b border-white/5 bg-black">
        <button onClick={() => {
          if (step === 'from') onClose();
          else if (step === 'to') setStep('from');
          else if (step === 'amount') setStep('to');
          else if (step === 'confirm') setStep('amount');
        }} className="p-1"><BackIcon color="white" size={18} /></button>
        <h2 className="text-[14px] font-bold text-white tracking-tight">Between Accounts</h2>
        <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-black text-white/40">?</div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5">
        {step === 'from' && (
          <div className="animate-in fade-in space-y-4">
            <h3 className="text-white/40 font-black text-[9px] uppercase tracking-widest px-1">Transfer From</h3>
            <div className="space-y-2">
              {sourceAccounts.map(([name, d]) => (
                <button 
                  key={name} 
                  onClick={() => { setFromAccount(name); setStep('to'); }}
                  className="w-full p-5 bg-[#121212] rounded-[24px] border border-white/5 flex items-center justify-between active:bg-white/5 transition-all"
                >
                  <div className="text-left">
                    <p className="text-white font-bold text-[14px]">{name}</p>
                    <p className="text-[#ED0711] font-black text-[12px] mt-0.5">${d.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <ChevronRightIcon color="#ED0711" size={14} />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'to' && (
          <div className="animate-in fade-in space-y-4">
            <h3 className="text-white/40 font-black text-[9px] uppercase tracking-widest px-1">Transfer To</h3>
            <div className="space-y-2">
              {targetAccounts.map(([name, d]) => (
                <button 
                  key={name} 
                  onClick={() => { setToAccount(name); setStep('amount'); }}
                  className="w-full p-5 bg-[#121212] rounded-[24px] border border-white/5 flex items-center justify-between active:bg-white/5 transition-all"
                >
                  <div className="text-left">
                    <p className="text-white font-bold text-[14px]">{name}</p>
                    <p className="text-zinc-500 font-bold text-[11px] mt-0.5">${d.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <ChevronRightIcon color="#ED0711" size={14} />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'amount' && (
          <div className="p-6 flex flex-col items-center pt-10 animate-in slide-up">
            <div className="w-full text-center mb-10">
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Transferring From</p>
              <p className="text-white font-bold text-[15px]">{fromAccount}</p>
              <p className="text-zinc-400 font-bold text-[11px] mt-1">To: {toAccount}</p>
            </div>
            
            <div className="bg-[#121212] w-full p-10 rounded-[32px] text-center mb-10 border border-white/5 shadow-3xl">
              <span className="text-zinc-600 font-bold text-2xl mr-2 tracking-tighter">$</span>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="0.00" 
                className="bg-transparent text-white text-5xl font-black outline-none w-48 text-center tracking-tighter" 
                autoFocus 
              />
            </div>
            
            <button 
              onClick={() => amount && setStep('confirm')}
              className={`w-full py-5 rounded-2xl font-black text-[15px] uppercase tracking-widest transition-all ${amount ? 'bg-[#ED0711] text-white shadow-2xl' : 'bg-white/5 text-white/10'}`}
            >
              Continue
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="p-8 flex flex-col items-center pt-12 animate-in slide-up h-full">
            <h3 className="text-white font-black text-xl mb-8 tracking-tighter uppercase opacity-80">Confirm Transfer</h3>
            <div className="w-full space-y-4 bg-[#121212] p-8 rounded-[28px] border border-white/5 mb-10 shadow-2xl">
              <div className="flex justify-between items-center pb-3.5 border-b border-white/5">
                <span className="text-zinc-600 font-black text-[9px] uppercase tracking-widest">From</span>
                <span className="text-white font-bold text-[13px] tracking-tight truncate ml-4">{fromAccount}</span>
              </div>
              <div className="flex justify-between items-center pb-3.5 border-b border-white/5">
                <span className="text-zinc-600 font-black text-[9px] uppercase tracking-widest">To</span>
                <span className="text-white font-bold text-[13px] tracking-tight truncate ml-4">{toAccount}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-zinc-600 font-black text-[9px] uppercase tracking-widest">Amount</span>
                <span className="text-[#ED0711] font-black text-[18px] tracking-tighter">${parseFloat(amount).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleComplete}
              className="w-full mt-auto mb-10 py-5 bg-[#ED0711] text-white font-black rounded-2xl active:scale-95 transition-all shadow-2xl uppercase tracking-widest text-[13px]"
            >
              Complete Transfer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountTransferFlow;
