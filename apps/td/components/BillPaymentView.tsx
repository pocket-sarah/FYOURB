
import React, { useState } from 'react';
// Fixed: Re-added ChevronRightIcon import.
import { BackIcon, ChevronRightIcon } from '../TDIcons';
import { ScotiaAccountMap, ScotiaAccount } from '../../scotia/types';
import { INITIAL_PAYEES } from '../../scotia/constants';

interface BillPaymentViewProps {
  accounts: ScotiaAccountMap;
  onPay: (amount: number, payee: string, fromAccount: string) => void;
  onBack: () => void;
}

const BillPaymentView: React.FC<BillPaymentViewProps> = ({ accounts, onPay, onBack }) => {
  const [stage, setStage] = useState<'list' | 'amount' | 'confirm' | 'success'>('list');
  const [selectedPayee, setSelectedPayee] = useState<typeof INITIAL_PAYEES[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('TD Unlimited Chequing');

  const bankingAccounts = (Object.entries(accounts) as [string, ScotiaAccount][]).filter(([_, d]) => d.type === 'banking');

  const handlePay = () => {
    if (selectedPayee && amount) {
        onPay(parseFloat(amount), selectedPayee.name, fromAccount);
        setStage('success');
    }
  };

  return (
    <div className="absolute inset-0 bg-[#f4f4f4] z-50 flex flex-col animate-in slide-up">
        {/* Header */}
        <div className="bg-[#008A00] pt-14 pb-4 px-4 flex items-center justify-between shadow-md shrink-0">
            <button onClick={onBack} className="text-white"><BackIcon color="white" /></button>
            <h2 className="text-white font-bold text-lg">Pay Bills</h2>
            <div className="w-6"></div>
        </div>

        {stage === 'list' && (
            <div className="p-4 space-y-6 overflow-y-auto flex-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                    <span className="text-gray-600 font-bold text-sm">Add Payee</span>
                    <button className="w-8 h-8 bg-[#008A00]/10 rounded-full flex items-center justify-center text-[#008A00] font-bold">+</button>
                </div>

                <div className="space-y-2">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider px-2">My Payees</h3>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
                        {INITIAL_PAYEES.map(payee => (
                            <button 
                                key={payee.id}
                                onClick={() => { setSelectedPayee(payee); setStage('amount'); }}
                                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-all"
                            >
                                <div className="text-left">
                                    <p className="text-gray-800 font-bold text-sm">{payee.name}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{payee.accountNumber}</p>
                                </div>
                                <span className="text-[#008A00] font-bold text-xs">PAY</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {stage === 'amount' && selectedPayee && (
            <div className="p-6 flex flex-col flex-1 animate-in slide-up">
                <div className="flex items-center gap-2 mb-8">
                    <button onClick={() => setStage('list')} className="text-[#008A00] font-bold text-sm">Cancel</button>
                </div>

                <div className="text-center mb-8">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Payment To</p>
                    <h3 className="text-[#008A00] font-bold text-xl">{selectedPayee.name}</h3>
                    <p className="text-gray-400 text-xs mt-1">{selectedPayee.accountNumber}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                    <label className="block text-gray-500 text-xs font-bold uppercase mb-2">Amount</label>
                    <div className="flex items-center border-b border-gray-200 pb-2">
                        <span className="text-2xl font-bold text-gray-400 mr-2">$</span>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="w-full text-3xl font-bold text-gray-800 outline-none bg-transparent" 
                            placeholder="0.00" 
                            autoFocus
                        />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
                    <label className="block text-gray-500 text-xs font-bold uppercase mb-2">From Account</label>
                    <select 
                        value={fromAccount} 
                        onChange={e => setFromAccount(e.target.value)}
                        className="w-full bg-transparent font-bold text-sm outline-none text-gray-800"
                    >
                        {bankingAccounts.map(([name, acc]) => (
                            <option key={name} value={name}>{name} (${acc.balance.toFixed(2)})</option>
                        ))}
                    </select>
                </div>

                <button 
                    onClick={() => amount && setStage('confirm')}
                    className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all ${amount ? 'bg-[#008A00]' : 'bg-gray-300'}`}
                >
                    Continue
                </button>
            </div>
        )}

        {stage === 'confirm' && selectedPayee && (
            <div className="p-6 flex flex-col flex-1 animate-in slide-up">
                <h3 className="text-gray-800 font-bold text-xl mb-6">Confirm Payment</h3>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4 mb-8">
                    <div className="flex justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-500 text-sm">Payee</span>
                        <span className="text-gray-800 font-bold text-sm text-right">{selectedPayee.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-500 text-sm">From</span>
                        <span className="text-gray-800 font-bold text-sm text-right">{fromAccount}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-gray-500 text-sm">Amount</span>
                        <span className="text-[#008A00] font-black text-xl">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                </div>

                <button 
                    onClick={handlePay}
                    className="w-full py-4 bg-[#008A00] text-white font-bold rounded-lg shadow-lg active:scale-95 transition-all"
                >
                    Pay Bill
                </button>
            </div>
        )}

        {stage === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in">
                <div className="w-20 h-20 bg-[#008A00] rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h2>
                <p className="text-gray-500 mb-10">Confirmation #TD-{Math.floor(Math.random()*100000)}</p>
                <button 
                    onClick={onBack} 
                    className="px-8 py-3 border-2 border-[#008A00] text-[#008A00] font-bold rounded-full"
                >
                    Done
                </button>
            </div>
        )}
    </div>
  );
};

export default BillPaymentView;
