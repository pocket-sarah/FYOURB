
import React from 'react';
import { ChevronRightIcon } from '../../TDIcons'; // Using ChevronRightIcon for consistency

interface SelectionCardProps {
    label: string;
    value?: string;
    subtext?: string;
    onClick: () => void;
    empty?: boolean;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ label, value, subtext, onClick, empty = false }) => (
    <div onClick={onClick} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center active:bg-gray-50 transition-all cursor-pointer">
        <div className="flex-1 min-w-0">
            <p className="text-gray-500 font-bold text-xs uppercase mb-1">{label}</p>
            {empty ? (
                <p className="text-gray-400 text-[15px] font-semibold">Select {label.toLowerCase()}</p>
            ) : (
                <>
                    <p className={`font-bold text-[16px] tracking-tight truncate ${value ? 'text-gray-800' : 'text-gray-400'}`}>{value}</p>
                    {subtext && <p className="text-gray-500 text-xs">{subtext}</p>}
                </>
            )}
        </div>
        <div className="p-1 rounded-sm ml-4">
            <ChevronRightIcon color="#999" size={20} />
        </div>
    </div>
);

export default SelectionCard;
