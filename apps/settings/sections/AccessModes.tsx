import React from 'react';
import { SystemConfig } from '../../../data/systemConfig.ts';
import { Toggle, CommonFieldProps } from '../components/Shared.tsx';

interface AccessModesProps extends CommonFieldProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
}

export const AccessModesSection: React.FC<AccessModesProps> = ({ config, updateField, isHacker, isGod, isDev }) => {
  return (
    <div className="space-y-6 animate-in slide-up">
        <h2 className="text-2xl font-bold mb-8">System Privilege Override</h2>
        <div className="bg-zinc-900/40 p-5 rounded-[32px] border border-white/5 mb-8">
           <p className="text-xs leading-relaxed opacity-60">Enabling these modes overrides standard security protocols and UI paradigms.</p>
        </div>
        
        <Toggle label="Hacker Mode" active={config.modes.hacker_mode} onToggle={v => updateField('modes.hacker_mode', v)} accentColor="bg-green-500" isHacker={isHacker} />
        <Toggle label="God Mode" active={config.modes.god_mode} onToggle={v => updateField('modes.god_mode', v)} accentColor="bg-yellow-500" isGod={isGod} />
        <Toggle label="Developer Mode" active={config.modes.developer_mode} onToggle={v => updateField('modes.developer_mode', v)} isDev={isDev} />
        <Toggle label="Experimental UI" active={config.modes.experimental_ui} onToggle={v => updateField('modes.experimental_ui', v)} />
    </div>
  );
};