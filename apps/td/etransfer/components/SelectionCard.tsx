import React from 'react';

interface SelectionCardProps {
    label: string;
    value?: string;
    subtext?: string;
    onClick: () => void;
    empty?: boolean;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ label, value, subtext, onClick, empty = false }) => (
    <div onClick={onClick} className="py-5 flex justify-between items-center active:bg-gray-50 transition-all cursor-pointer">
        <div className="flex-1 min-w-0">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">{label}</p>
            {empty ? (
                <p className="text-gray-300 text-[15px] font-semibold italic">Select {label.toLowerCase()}</p>
            ) : (
                <>
                    <p className={`font-bold text-[16px] tracking-tight truncate ${value ? 'text-gray-800' : 'text-gray-300'}`}>{value}</p>
                    {subtext && <p className="text-gray-400 text-[12px] font-semibold">{subtext}</p>}
                </>
            )}
        </div>
        <div className="p-1 rounded-sm ml-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
    </div>
);

export default SelectionCard;