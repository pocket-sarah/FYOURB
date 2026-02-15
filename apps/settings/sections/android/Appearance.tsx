import React from 'react';
import { SystemConfig } from '../../../../data/systemConfig.ts';
import { Toggle, InputField, CommonFieldProps } from '../../components/Shared.tsx';

export const AppearanceSection: React.FC<{ config: SystemConfig; updateField: any } & CommonFieldProps> = ({ config, updateField, ...props }) => (
    <div className="space-y-6 animate-in slide-up">
        <h2 className="text-2xl font-bold mb-8">Interface Sync</h2>
        <Toggle label="Dark Mode" active={config.display_options.dark_mode} onToggle={v => updateField('display_options.dark_mode', v)} {...props} />
        <Toggle label="Adaptive Brightness" active={config.display_options.adaptive_brightness} onToggle={v => updateField('display_options.adaptive_brightness', v)} {...props} />
        <InputField label="Font Size" value={config.display_options.font_size} onChange={v => updateField('display_options.font_size', v)} {...props} />
    </div>
);