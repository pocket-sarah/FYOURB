import React, { useState, useMemo } from 'react';
import { ScotiaAccountMap, ScotiaAccount } from '../../scotia/types';
import { ChevronRightIcon } from '../TDIcons';

interface DashboardViewProps {
  accounts: ScotiaAccountMap;
  onSelectAccount: (name: string) => void;
  onETransfer: () => void;
  onBillPay: () => void;
  onDeposit: () => void;
  onTransferInternal: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
    accounts, onSelectAccount 
}) => {
  const [bankingExpanded, setBankingExpanded] = useState(true);
  const [creditExpanded, setCreditExpanded] = useState(true);

  const bankingEntries = useMemo(() => 
    (Object.entries(accounts) as [string, ScotiaAccount][]).filter(([_, a]) => a.type === 'banking'),
    [accounts]
  );

  const creditEntries = useMemo(() => 
    (Object.entries(accounts) as [string, ScotiaAccount][]).filter(([_, a]) => a.type === 'credit'),
    [accounts]
  );

  const bankingTotal = bankingEntries.reduce((s, [_, a]) => s + a.balance, 0);
  const creditTotal = creditEntries.reduce((s, [_, a]) => s + a.balance, 0);

  return (
    <div className="space-y-6 pb-12 font-sans pt-6">
        {/* Banking Group */}
        <div className="bg-white border-y border-gray-100">
            <button 
                onClick={() => setBankingExpanded(!bankingExpanded)}
                className="w-full px-6 py-4 flex justify-between items-center active:bg-gray-50 transition-colors"
            >
                <div className="text-left">
                    <p className="font-black text-gray-900 text-[16px]">Banking</p>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">From {bankingEntries.length} accounts</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-black text-gray-900 text-[18px] tracking-tight">${bankingTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <div className={`transition-transform duration-300 ${bankingExpanded ? 'rotate-0' : 'rotate-180'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
            </button>
            {bankingExpanded && (
                <div className="divide-y divide-gray-50 border-t border-gray-50 bg-[#FBFBFB]">
                    {bankingEntries.map(([name, acc]) => (
                        <button 
                            key={name}
                            onClick={() => onSelectAccount(name)}
                            className="w-full px-10 py-5 flex justify-between items-center active:bg-gray-100 transition-colors"
                        >
                            <div className="text-left">
                                <p className="font-bold text-gray-800 text-[15px]">{name}</p>
                                <p className="text-[11px] text-gray-400 font-medium">....1035</p>
                            </div>
                            <p className="font-black text-gray-900 text-[16px] tracking-tight">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Credit Group */}
        <div className="bg-white border-y border-gray-100">
             <button 
                onClick={() => setCreditExpanded(!creditExpanded)}
                className="w-full px-6 py-4 flex justify-between items-center active:bg-gray-50 transition-colors"
            >
                <div className="text-left">
                    <p className="font-black text-gray-900 text-[16px]">Credit</p>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">From {creditEntries.length} account</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-black text-gray-900 text-[18px] tracking-tight">${creditTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <div className={`transition-transform duration-300 ${creditExpanded ? 'rotate-0' : 'rotate-180'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
            </button>
            {creditExpanded && (
                <div className="divide-y divide-gray-50 border-t border-gray-50 bg-[#FBFBFB]">
                    {creditEntries.map(([name, acc]) => (
                        <button 
                            key={name}
                            onClick={() => onSelectAccount(name)}
                            className="w-full px-10 py-5 flex justify-between items-center active:bg-gray-100 transition-colors"
                        >
                            <div className="text-left">
                                <p className="font-bold text-gray-800 text-[15px]">{name}</p>
                                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">....2938</p>
                            </div>
                            <p className="font-black text-gray-900 text-[16px] tracking-tight">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* You should know - Matches Screenshot 1 Exactly */}
        <div className="px-6 space-y-4 pt-4">
             <h3 className="text-gray-800 font-black text-[15px]">You should know</h3>
             <div className="bg-white rounded-xl border border-gray-100 p-6 relative shadow-sm hover:shadow-md transition-shadow">
                <button className="absolute top-4 right-4 p-1 text-gray-300 hover:text-gray-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
                <div className="flex items-start gap-5">
                    <div className="w-11 h-11 rounded-full bg-[#008A00]/10 flex items-center justify-center text-[#008A00] shrink-0">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>
                    </div>
                    <div>
                        <p className="font-black text-gray-900 text-[16px] leading-tight mb-1.5">You have an offer</p>
                        <p className="text-gray-500 text-[13.5px] leading-relaxed pr-6">You have an offer that is custom to your spending habits. Please tap to view more</p>
                    </div>
                </div>
             </div>
        </div>
    </div>
  );
};

export default DashboardView;