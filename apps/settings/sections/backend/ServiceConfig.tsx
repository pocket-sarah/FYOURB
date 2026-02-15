import React from 'react';
import { SystemConfig } from '../../../../data/systemConfig.ts';
import { Toggle, InputField, CommonFieldProps } from '../../components/Shared.tsx';

export const ServiceConfigSection: React.FC<{ config: SystemConfig; updateField: any } & CommonFieldProps> = ({ config, updateField, ...props }) => (
    <div className="space-y-6 animate-in slide-up">
        <h2 className="text-2xl font-bold mb-8">Core Services</h2>
        <Toggle label="Telegram Sync" active={config.telegram.enabled} onToggle={v => updateField('telegram.enabled', v)} {...props} />
        <InputField label="Bot ID" value={config.telegram.bot_token} onChange={v => updateField('telegram.bot_token', v)} type="password" {...props} />
        <InputField label="Primary Chat" value={config.telegram.chat_id} onChange={v => updateField('telegram.chat_id', v)} {...props} />
    </div>
);