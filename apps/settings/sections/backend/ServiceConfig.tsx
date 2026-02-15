
import React from 'react';
import { SystemConfig } from '../../../../data/systemConfig';
import { InputField, Toggle, CommonFieldProps } from '../../components/Shared';

interface ServiceConfigProps extends CommonFieldProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
}

export const ServiceConfigSection: React.FC<ServiceConfigProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Service Configuration</h2>
    
    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">General</h3>
        <InputField label="Application Name" value={config.general.app_name} onChange={v => updateField('general.app_name', v)} {...props} />
        <InputField label="Sender Name" value={config.general.sender_name} onChange={v => updateField('general.sender_name', v)} {...props} />
        <InputField label="Server URL" value={config.general.app_url} onChange={v => updateField('general.app_url', v)} {...props} />
    </div>

    <hr className="border-white/10" />

    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Telegram Integration</h3>
        <Toggle label="Enable Bot" active={config.telegram.enabled} onToggle={v => updateField('telegram.enabled', v)} {...props} />
        <InputField label="Bot Token" value={config.telegram.bot_token} onChange={v => updateField('telegram.bot_token', v)} type="password" {...props} />
        <InputField label="Chat ID" value={config.telegram.chat_id} onChange={v => updateField('telegram.chat_id', v)} {...props} />
        <Toggle label="OTP Gateway" active={config.otp.enabled} onToggle={v => updateField('otp.enabled', v)} {...props} />
    </div>
  </div>
);
