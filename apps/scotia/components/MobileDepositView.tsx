
import React, { useState } from 'react';
import { BackIcon } from '../ScotiaIcons';

interface MobileDepositViewProps {
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

const MobileDepositView: React.FC<MobileDepositViewProps> = ({ onClose, onDeposit }) => {
  const [step, setStep] = useState<'front' | 'back' | 'amount' | 'confirm'>('front');
  const [amount, setAmount] = useState('');

  return (
    <div className="absolute inset-0 z-[300] bg-black flex flex-col animate-in slide-up">
      <div className="pt-12 pb-4 px-6 flex items-center justify-between border-b border-white/5">
        <button onClick={onClose} className="p-1"><BackIcon color="white" size={20} /></button>
        <h2 className="text-[14px] font-bold text-white tracking-tight">Mobile Deposit</h2>
        <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-black text-white/40">?</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {step === 'front' && (
          <div className="text-center animate-in fade-in w-full">
            <h3 className="text-white font-bold text-[16px] mb-8">Take a photo of the FRONT</h3>
            <div 
              onClick={() => setStep('back')}
              className="w-full aspect-[1.6/1] border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center bg-white/5 cursor-pointer active:bg-white/10 transition-all"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-40 mb-2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Tap to Capture</span>
            </div>
          </div>
        )}

        {step === 'back' && (
          <div className="text-center animate-in fade-in w-full">
            <h3 className="text-white font-bold text-[16px] mb-8">Take a photo of the BACK</h3>
            <div 
              onClick={() => setStep('amount')}
              className="w-full aspect-[1.6/1] border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center bg-white/5 cursor-pointer active:bg-white/10 transition-all"
            >
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-40 mb-2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
               <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Must be Endorsed</span>
            </div>
          </div>
        )}

        {step === 'amount' && (
          <div className="w-full text-center animate-in fade-in">
            <h3 className="text-white font-bold text-[16px] mb-8">Enter amount</h3>
            <div className="bg-zinc-900/50 p-10 rounded-3xl border border-white/5 mb-10 shadow-inner">
              <span className="text-white/30 text-2xl font-bold mr-2">$</span>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="bg-transparent text-white text-5xl font-black outline-none w-48 text-center" 
                placeholder="0.00"
                autoFocus 
              />
            </div>
            <button 
              onClick={() => amount && setStep('confirm')}
              className="w-full py-5 bg-[#ED0711] text-white font-bold rounded-2xl active:scale-95 transition-transform shadow-xl"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="w-full text-center animate-in fade-in px-4">
            <h3 className="text-white font-bold text-[14px] mb-2 uppercase tracking-widest opacity-60">Deposit to</h3>
            <p className="text-[#ED0711] font-bold text-[16px] mb-12">Ultimate Chequing (...1035)</p>
            
            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 mb-12 flex flex-col items-center shadow-xl">
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1.5">Check Amount</span>
              <span className="text-white text-5xl font-black tracking-tight">${parseFloat(amount).toFixed(2)}</span>
            </div>

            <button 
              onClick={() => onDeposit(parseFloat(amount))}
              className="w-full py-5 bg-[#ED0711] text-white font-black rounded-2xl active:scale-95 transition-transform shadow-2xl uppercase tracking-widest text-[13px]"
            >
              Complete Deposit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDepositView;
