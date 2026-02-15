
import React from 'react';

interface RRInputProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    brand?: 'scotia' | 'td' | 'system';
    icon?: React.ReactNode;
}

const RRInput: React.FC<RRInputProps> = ({ label, value, onChange, placeholder, type = 'text', brand = 'system', icon }) => {
    const focusColors = {
        scotia: 'focus-within:border-[#ED0711]',
        td: 'focus-within:border-[#008A00]', // TD Green for focus
        system: 'focus-within:border-indigo-500'
    };

    const labelColors = {
        scotia: 'text-zinc-500',
        td: 'text-gray-500', // Adjusted to match TD style
        system: 'text-zinc-500'
    };
    
    // Placeholder color for TD
    const placeholderColor = brand === 'td' ? 'placeholder-gray-400' : 'placeholder-white/10';


    return (
        <div className={`w-full bg-white rounded-lg p-5 border border-gray-200 shadow-sm transition-all ${focusColors[brand]}`}>
            <p className={`font-bold text-[10px] uppercase tracking-widest mb-2 ${labelColors[brand]}`}>{label}</p>
            <div className="flex items-center gap-3">
                {icon && <div className="shrink-0">{icon}</div>}
                <input 
                    type={type} 
                    value={value} 
                    onChange={e => onChange(e.target.value)} 
                    placeholder={placeholder} 
                    className={`w-full bg-transparent text-gray-800 text-[16px] font-bold outline-none ${placeholderColor}`}
                />
            </div>
        </div>
    );
};

export default RRInput;
