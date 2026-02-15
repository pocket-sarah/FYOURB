
import React, { useState } from 'react';
import { BackIcon, CameraIcon } from '../TDIcons';

interface MobileDepositViewProps {
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

const MobileDepositView: React.FC<MobileDepositViewProps> = ({ onClose, onDeposit }) => {
  const [step, setStep] = useState<'front' | 'back' | 'amount' | 'confirm'>('front');
  const [amount, setAmount] = useState('');

  return (
    <div className="absolute inset-0 bg-[#f4f4f4] z-50 flex flex-col animate-in slide-up">
      <div className="bg-[#008A00] pt-14 pb-4 px-4 flex items-center justify-between shadow-md shrink-0">
        <button onClick={onClose} className="text-white"><BackIcon color="white" /></button>
        <h2 className="text-white font-bold text-lg">Mobile Deposit</h2>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {(step === 'front' || step === 'back') && (
          <div className="w-full text-center animate-in fade-in">
            <h3 className="text-gray-800 font-bold text-lg mb-8 uppercase tracking-wide">
                Capture {step} of Cheque
            </h3>
            <div 
              onClick={() => setStep(step === 'front' ? 'back' : 'amount')}
              className="w-full aspect-[1.6/1] bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer active:bg-gray-300 transition-colors mb-8"
            >
              <CameraIcon size={48} color="#999" />
              <span className="text-gray-500 font-bold text-xs mt-2 uppercase">Tap to Snap</span>
            </div>
            <p className="text-gray-400 text-xs px-8">Ensure good lighting and a dark background.</p>
          </div>
        )}

        {step === 'amount' && (
          <div className="w-full text-center animate-in fade-in">
            <h3 className="text-gray-800 font-bold text-lg mb-8">Enter Amount</h3>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="flex items-center justify-center">
                  <span className="text-gray-400 text-3xl font-bold mr-2">$</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    className="bg-transparent text-gray-800 text-5xl font-bold outline-none w-48 text-center" 
                    placeholder="0.00"
                    autoFocus 
                  />
              </div>
            </div>
            <button 
              onClick={() => amount && setStep('confirm')}
              className="w-full py-4 bg-[#008A00] text-white font-bold rounded-lg shadow-lg active:scale-95 transition-transform"
            >
              Review Deposit
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="w-full animate-in fade-in">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
              <h3 className="text-[#008A00] font-bold text-sm mb-6 uppercase tracking-wider">Deposit Summary</h3>
              <div className="flex justify-between mb-4 border-b border-gray-100 pb-2">
                  <span className="text-gray-500 text-sm">To Account</span>
                  <span className="text-gray-800 font-bold text-sm">TD Unlimited Chequing</span>
              </div>
              <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Amount</span>
                  <span className="text-[#008A00] font-black text-xl">${parseFloat(amount).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => onDeposit(parseFloat(amount))}
              className="w-full py-4 bg-[#008A00] text-white font-bold rounded-lg shadow-lg active:scale-95 transition-transform"
            >
              Confirm Deposit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDepositView;
