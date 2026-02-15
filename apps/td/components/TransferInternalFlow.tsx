
import React, { useState } from 'react';
import { BackIcon } from '../TDIcons';
import { ScotiaAccountMap, ScotiaAccount } from '../../scotia/types';

interface TransferInternalFlowProps {
  accounts: ScotiaAccountMap;
  onClose: () => void;
  onComplete: (type: 'internal', amount: number, payload: any) => void;
}

const TransferInternalFlow: React.FC<TransferInternalFlowProps> = ({ accounts, onClose, onComplete }) => {
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [fromAccount, setFromAccount] = useState<string>('TD Unlimited Chequing');
  const [toAccount, setToAccount] = useState<string>('TD Every Day Savings');
  const [amount, setAmount] = useState('');

  const accountNames = Object.keys(accounts);

  const handleTransfer = () => {
    onComplete('internal', parseFloat(amount), { from: fromAccount, to: toAccount });
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-[#f4f4f4] z-50 flex flex-col animate-in slide-up">
      <div className="bg-[#008A00] pt-14 pb-4 px-4 flex items-center justify-between shadow-md shrink-0">
        <button onClick={onClose} className="text-white"><BackIcon color="white" /></button>
        <h2 className="text-white font-bold text-lg">Transfer Funds</h2>
        <div className="w-6"></div>
      </div>

      <div className="p-6 flex-1 flex flex-col overflow-y-auto">
        {step === 'form' && (
            <div className="space-y-6 animate-in fade-in">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <label className="block text-gray-500 text-xs font-bold uppercase mb-2">From</label>
                    <select 
                        value={fromAccount} 
                        onChange={e => setFromAccount(e.target.value)}
                        className="w-full bg-transparent font-bold text-gray-800 text-sm outline-none"
                    >
                        {accountNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <label className="block text-gray-500 text-xs font-bold uppercase mb-2">To</label>
                    <select 
                        value={toAccount} 
                        onChange={e => setToAccount(e.target.value)}
                        className="w-full bg-transparent font-bold text-gray-800 text-sm outline-none"
                    >
                        {accountNames.filter(n => n !== fromAccount).map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                    <label className="block text-gray-500 text-xs font-bold uppercase mb-2">Amount</label>
                    <div className="flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400 mr-2">$</span>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="w-32 bg-transparent text-4xl font-bold text-gray-800 text-center outline-none" 
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <button 
                    onClick={() => amount && setStep('confirm')}
                    className={`w-full py-4 rounded-lg font-bold text-white shadow-lg mt-8 transition-all ${amount ? 'bg-[#008A00]' : 'bg-gray-300'}`}
                >
                    Continue
                </button>
            </div>
        )}

        {step === 'confirm' && (
            <div className="space-y-6 animate-in slide-up h-full flex flex-col">
                <h3 className="text-gray-800 font-bold text-xl mb-4">Review Transfer</h3>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                    <div className="flex justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-500 text-sm">From</span>
                        <span className="text-gray-800 font-bold text-sm text-right max-w-[60%]">{fromAccount}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-3">
                        <span className="text-gray-500 text-sm">To</span>
                        <span className="text-gray-800 font-bold text-sm text-right max-w-[60%]">{toAccount}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-gray-500 text-sm">Amount</span>
                        <span className="text-[#008A00] font-black text-xl">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <button 
                        onClick={handleTransfer}
                        className="w-full py-4 bg-[#008A00] text-white font-bold rounded-lg shadow-lg active:scale-95 transition-all"
                    >
                        Complete Transfer
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TransferInternalFlow;
