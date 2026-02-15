
import React from 'react';

// Added isDark and isDev properties to CommonFieldProps to resolve usage in various sections.
export interface CommonFieldProps {
  isHacker?: boolean;
  isGod?: boolean;
  isDev?: boolean;
  // Fix: Added isDark property to avoid type errors when passed from SettingsApp
  isDark?: boolean;
}

export interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  min?: string; 
  max?: string; 
}

export const InputField = ({ label, value, onChange, type = "text", placeholder = "", min, max, ...props }: InputFieldProps & CommonFieldProps) => (
  <div className={`p-5 rounded-[24px] border transition-all focus-within:ring-2 ${props.isHacker ? 'bg-black/60 border-[#00ff41]/20 focus-within:border-[#00ff41] focus-within:ring-[#00ff41]/20' : 'bg-white border-zinc-200 focus-within:border-indigo-500 focus-within:ring-indigo-500/10 shadow-sm'}`}>
    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-1 ${props.isHacker ? 'text-[#00ff41]/40' : 'text-zinc-400'}`}>{label}</p>
    <input 
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      className={`w-full bg-transparent font-bold text-[16px] outline-none placeholder-zinc-300 ${props.isHacker ? 'text-[#00ff41]' : 'text-zinc-800'}`}
    />
  </div>
);

export const InfoField = ({ label, value, ...props }: { label: string, value: string } & CommonFieldProps) => (
  <div className={`p-5 rounded-[24px] border ${props.isHacker ? 'bg-black/60 border-[#00ff41]/20' : 'bg-white border-zinc-200 shadow-sm'}`}>
    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-1 ${props.isHacker ? 'text-[#00ff41]/40' : 'text-zinc-400'}`}>{label}</p>
    <p className={`w-full font-bold text-[16px] tracking-tight ${props.isHacker ? 'text-[#00ff41]' : 'text-zinc-800'}`}>{value}</p>
  </div>
);

export const Toggle = ({ label, active, onToggle, accentColor, ...props }: { label: string, active: boolean, onToggle: (v: boolean) => void, accentColor?: string } & CommonFieldProps) => {
  const isHacker = props.isHacker;
  const toggleBg = active 
    ? (accentColor || (isHacker ? 'bg-[#00ff41]' : 'bg-indigo-600')) 
    : (isHacker ? 'bg-zinc-800' : 'bg-zinc-200');

  return (
    <button 
        onClick={() => onToggle(!active)}
        className={`w-full flex items-center justify-between p-5 rounded-[24px] border transition-all active:scale-[0.98] ${isHacker ? 'bg-black/60 border-[#00ff41]/20' : 'bg-white border-zinc-200 shadow-sm'}`}
    >
        <span className={`font-bold text-[15px] tracking-tight ${isHacker ? 'text-[#00ff41]' : 'text-zinc-700'}`}>{label}</span>
        <div className={`w-12 h-7 rounded-full transition-all relative p-1 ${toggleBg}`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-all transform shadow-md ${active ? 'translate-x-5' : 'translate-x-0'} ${isHacker && active ? 'bg-black' : ''}`} />
        </div>
    </button>
  );
};
