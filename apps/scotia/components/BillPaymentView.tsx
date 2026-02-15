
import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '../ScotiaIcons';
import { ScotiaAccountMap, ScotiaAccount } from '../types';
import { INITIAL_PAYEES } from '../constants';

interface BillPaymentViewProps {
  accounts: ScotiaAccountMap;
  onPay: (amount: number, payee: string, fromAccount: string) => void;
}

const BillPaymentView: React.FC<BillPaymentViewProps> = ({ accounts, onPay }) => {
  const [stage, setStage] = useState<'list' | 'amount' | 'confirm' | 'success'>('list');
  const [selectedPayee, setSelectedPayee] = useState<typeof INITIAL_PAYEES[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('Ultimate Chequing');

  // Filter for valid source accounts
  const bankingAccounts = (Object.entries(accounts) as [string, ScotiaAccount][]).filter(([_, d]) => d.type === 'banking');

  const handlePay = () => {
    if (selectedPayee && amount) {
        onPay(parseFloat(amount), selectedPayee.name, fromAccount);
        setStage('success');
        setTimeout(() => {
            setStage('list');
            setAmount('');
            setSelectedPayee(null);
        }, 2500);
    }
  };

  return (
    <div className="h-full flex flex-col pt-4 px-4 pb-20 overflow-y-auto no-scrollbar">
        {stage === 'list' && (
            <div className="space-y-6 animate-in fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-white font-bold text-[22px] tracking-tight">Pay Bills</h2>
                    <button className="w-8 h-8 rounded-full bg-[#ED0711]/10 flex items-center justify-center text-[#ED0711] font-bold text-xl">+</button>
                </div>

                {/* Upcoming */}
                <div className="bg-zinc-900 rounded-[24px] p-5 border border-white/5 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-white font-bold text-sm">Upcoming Payments</span>
                        <ChevronRightIcon color="#555" size={14} />
                    </div>
                    <p className="text-zinc-500 text-xs">No scheduled payments.</p>
                </div>

                {/* Payees List */}
                <div className="space-y-3">
                    <h3 className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest px-1">My Payees</h3>
                    <div className="bg-zinc-900 rounded-[24px] overflow-hidden border border-white/5 divide-y divide-white/5">
                        {INITIAL_PAYEES.map(payee => (
                            <button 
                                key={payee.id}
                                onClick={() => { setSelectedPayee(payee); setStage('amount'); }}
                                className="w-full p-5 flex justify-between items-center active:bg-white/5 transition-all"
                            >
                                <div className="text-left">
                                    <p className="text-white font-bold text-sm">{payee.name}</p>
                                    <p className="text-zinc-500 text-[10px] font-medium tracking-wide mt-0.5">{payee.accountNumber}</p>
                                </div>
                                <div className="px-4 py-1.5 bg-zinc-800 rounded-full text-[#ED0711] font-bold text-[11px] uppercase tracking-wide">
                                    Pay
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {stage === 'amount' && selectedPayee && (
            <div className="flex-1 flex flex-col pt-4 animate-in slide-up">
                <div className="flex items-center gap-2 mb-8">
                    <button onClick={() => setStage('list')} className="text-[#ED0711] font-bold text-sm">Cancel</button>
                </div>

                <div className="text-center mb-8">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Payment To</p>
                    <h3 className="text-white font-bold text-xl">{selectedPayee.name}</h3>
                    <p className="text-zinc-600 text-xs mt-1">{selectedPayee.accountNumber}</p>
                </div>

                <div className="bg-zinc-900/50 p-8 rounded-[32px] border border-white/5 mb-8 flex flex-col items-center">
                    <span className="text-zinc-600 font-bold text-2xl mr-2">$</span>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        placeholder="0.00" 
                        className="bg-transparent text-white text-5xl font-black outline-none w-48 text-center tracking-tighter" 
                        autoFocus 
                    />
                </div>

                <div className="space-y-2 mb-10">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest px-2">From Account</p>
                    <div className="bg-zinc-900 rounded-[20px] p-2 border border-white/5">
                        <select 
                            value={fromAccount} 
                            onChange={e => setFromAccount(e.target.value)}
                            className="w-full bg-transparent text-white font-bold text-sm p-4 outline-none appearance-none"
                        >
                            {bankingAccounts.map(([name, acc]) => (
                                <option key={name} value={name}>{name} - ${acc.balance.toFixed(2)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button 
                    onClick={() => amount && setStage('confirm')}
                    className={`w-full py-4 rounded-[18px] font-bold text-lg shadow-lg transition-all ${amount ? 'bg-[#ED0711] text-white' : 'bg-zinc-800 text-white/20'}`}
                >
                    Continue
                </button>
            </div>
        )}

        {stage === 'confirm' && selectedPayee && (
            <div className="flex-1 flex flex-col pt-8 animate-in slide-up">
                <h3 className="text-white font-bold text-xl mb-8">Confirm Payment</h3>
                
                <div className="bg-zinc-900 rounded-[24px] p-6 border border-white/5 space-y-6 mb-8">
                    <div className="flex justify-between">
                        <span className="text-zinc-500 text-xs font-bold uppercase">Payee</span>
                        <span className="text-white font-bold text-sm text-right">{selectedPayee.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500 text-xs font-bold uppercase">From</span>
                        <span className="text-white font-bold text-sm text-right">{fromAccount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500 text-xs font-bold uppercase">Date</span>
                        <span className="text-white font-bold text-sm text-right">Today</span>
                    </div>
                    <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Amount</span>
                        <span className="text-[#ED0711] font-black text-2xl">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                </div>

                {/* Slider */}
                <div className="mt-auto">
                    <button 
                        onClick={handlePay}
                        className="w-full py-5 bg-[#ED0711] text-white font-black rounded-2xl shadow-2xl uppercase tracking-widest text-[13px] active:scale-95 transition-transform"
                    >
                        Slide to Pay
                    </button>
                </div>
            </div>
        )}

        {stage === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Payment Sent</h3>
                <p className="text-zinc-500 text-sm">Confirmation #992837</p>
            </div>
        )}
    </div>
  );
};

export default BillPaymentView;
