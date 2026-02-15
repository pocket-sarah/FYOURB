import React from 'react';
import { SystemConfig } from '../../../data/systemConfig';
import { Toggle, CommonFieldProps } from '../components/Shared';

interface AccessModesProps extends CommonFieldProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
}

// Added isDev to destructured props to resolve property existence error in AccessModesSection.
export const AccessModesSection: React.FC<AccessModesProps> = ({ config, updateField, isHacker, isGod, isDev }) => {
  return (
    <div className="space-y-6 animate-in slide-up">
        <h2 className={`text-2xl font-bold mb-8 ${isHacker ? 'text-[#00ff41]' : isGod ? 'text-[#ffd700]' : 'text-white'}`}>System Privilege Override</h2>
        <div className={`${isHacker ? 'bg-[#001a04] border-[#00ff41]/20' : 'bg-zinc-900/40'} p-5 rounded-[32px] border border-white/5 mb-8`}>
           <p className={`text-[10px] uppercase font-black mb-3 tracking-widest ${isHacker ? 'text-[#00ff41]/40' : 'text-white/40'}`}>Warning</p>
           <p className={`text-xs leading-relaxed ${isHacker ? 'opacity-80' : 'opacity-60'}`}>Enabling these modes overrides standard security protocols and UI paradigms.</p>
        </div>
        
        <Toggle label="Hacker Mode" active={config.modes.hacker_mode} onToggle={v => updateField('modes.hacker_mode', v)} accentColor={isHacker ? 'bg-green-500' : 'bg-blue-400'} isHacker={isHacker} />
        <Toggle label="God Mode" active={config.modes.god_mode} onToggle={v => updateField('modes.god_mode', v)} accentColor={isGod ? 'bg-yellow-500' : 'bg-blue-400'} isGod={isGod} />
        {/* Fixed: isDev is passed correctly via props spreading as part of CommonFieldProps now that the interface is updated. */}
        <Toggle label="Developer Mode" active={config.modes.developer_mode} onToggle={v => updateField('modes.developer_mode', v)} isDev={isDev} />
        <Toggle label="Experimental UI" active={config.modes.experimental_ui} onToggle={v => updateField('modes.experimental_ui', v)} />

        {(isGod || isHacker) && (
            <div className="pt-8 border-t border-white/5 mt-8 space-y-4 animate-in fade-in">
                <h3 className={`text-xs font-black uppercase tracking-widest px-1 ${isHacker ? 'text-[#00ff41]/40' : 'opacity-40'}`}>Privileged Controls</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-zinc-900/60 rounded-[24px] border border-white/5 flex flex-col gap-2 items-start group">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 group-active:scale-90 transition-transform">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M2 12h20"/></svg>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isHacker ? 'text-[#00ff41]' : 'text-white'}`}>Flush Cache</span>
                    </button>
                    <button className="p-4 bg-zinc-900/60 rounded-[24px] border border-white/5 flex flex-col gap-2 items-start group">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 group-active:scale-90 transition-transform">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isHacker ? 'text-[#00ff41]' : 'text-white'}`}>Reset Keys</span>
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};