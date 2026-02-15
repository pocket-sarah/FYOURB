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
        td: 'focus-within:border-[#008A00]',
        system: 'focus-within:border-indigo-500'
    };

    const labelColors = {
        scotia: 'text-zinc-500',
        td: 'text-gray-400',
        system: 'text-zinc-500'
    };

    return (
        <div className={`w-full bg-[#1c1c1e] rounded-[24px] p-6 border border-white/5 shadow-2xl transition-all ${focusColors[brand]}`}>
            <p className={`font-black text-[11px] uppercase tracking-widest mb-2 ${labelColors[brand]}`}>{label}</p>
            <div className="flex items-center gap-3">
                {icon && <div className="shrink-0">{icon}</div>}
                <input 
                    type={type} 
                    value={value} 
                    onChange={e => onChange(e.target.value)} 
                    placeholder={placeholder} 
                    className="w-full bg-transparent text-white text-[18px] font-black outline-none placeholder-white/10"
                />
            </div>
        </div>
    );
};

export default RRInput;