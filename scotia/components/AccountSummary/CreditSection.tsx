import React from 'react';
import { ChevronDownIcon } from '../../ScotiaIcons';
import { ScotiaAccount } from '../../types';

interface CreditSectionProps {
    entries: [string, ScotiaAccount][];
    isExpanded: boolean;
    onToggle: () => void;
    onSelect: (name: string) => void;
    total: number;
}

const CreditSection: React.FC<CreditSectionProps> = ({ entries, isExpanded, onToggle, onSelect, total }) => (
    <div className="bg-[#1c1c1e] rounded-[12px] border border-white/5 overflow-hidden shadow-2xl transition-all">
        <button onClick={onToggle} className="w-full p-4 flex justify-between items-center border-b border-white/5 active:bg-white/5">
            <h3 className="text-[#ED0711] font-bold text-[12px] tracking-wide uppercase">Credit Cards ({entries.length})</h3>
            <div className={`transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}>
                <ChevronDownIcon size={16} color="#ED0711" />
            </div>
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="divide-y divide-white/5">
                {entries.map(([name, acc]) => (
                    <button key={name} onClick={() => onSelect(name)} className="w-full p-5 flex flex-col items-start active:bg-white/5 transition-all text-left">
                        <p className="text-white font-bold text-[15px]">{name}</p>
                        <p className="text-zinc-500 font-medium text-[14px] mt-0.5">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </button>
                ))}
            </div>
            <div className="p-4 bg-white/5 flex justify-between items-center border-t border-white/5">
                <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-widest">Total Credit</span>
                <span className="text-white font-bold text-[13px]">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        </div>
    </div>
);

export default CreditSection;