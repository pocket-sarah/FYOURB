
import React from 'react';
import { SystemConfig } from '../../../data/systemConfig';
import { InputField, Toggle, CommonFieldProps } from '../components/Shared';

interface ConfigSectionProps extends CommonFieldProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
}

export const GeneralSection: React.FC<ConfigSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">General Configuration</h2>
    <InputField label="Application Name" value={config.general.app_name} onChange={v => updateField('general.app_name', v)} {...props} />
    <InputField label="Sender Name" value={config.general.sender_name} onChange={v => updateField('general.sender_name', v)} {...props} />
    <InputField label="Server URL" value={config.general.app_url} onChange={v => updateField('general.app_url', v)} {...props} />
    <InputField label="Timezone" value={config.general.timezone} onChange={v => updateField('general.timezone', v)} {...props} />
    <Toggle label="Debug Mode" active={config.general.debug_mode} onToggle={v => updateField('general.debug_mode', v)} accentColor={config.general.debug_mode ? 'bg-orange-500' : 'bg-blue-400'} {...props} />
  </div>
);

export const SmtpSection: React.FC<ConfigSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">PHPMailer SMTP Settings</h2>
    <div className={`${props.isHacker ? 'bg-[#001a04]/50 border-[#00ff41]/10' : 'bg-zinc-900/50'} p-5 rounded-[32px] border border-white/5 mb-6`}>
       <p className={`text-xs leading-relaxed font-medium ${props.isHacker ? 'text-[#00ff41]/60' : 'opacity-50'}`}>These credentials authorize the PHP dispatch layer for Interac notifications.</p>
    </div>
    <InputField label="SMTP Host" value={config.smtp.host} onChange={v => updateField('smtp.host', v)} {...props} />
    <InputField label="SMTP Port" value={config.smtp.port.toString()} onChange={v => updateField('smtp.port', parseInt(v) || 587)} type="number" {...props} />
    <InputField label="Username" value={config.smtp.username} onChange={v => updateField('smtp.username', v)} {...props} />
    <InputField label="Password" value={config.smtp.password} onChange={v => updateField('smtp.password', v)} type="password" {...props} />
    <InputField label="Encryption" value={config.smtp.encryption} onChange={v => updateField('smtp.encryption', v)} placeholder="tls/ssl" {...props} />
    <hr className={`${props.isHacker ? 'border-[#00ff41]/10' : 'border-white/5'} my-8`} />
    <h3 className={`text-sm font-bold uppercase tracking-widest px-1 ${props.isHacker ? 'text-[#00ff41]/40' : 'opacity-40'}`}>Secondary SMTP (Failover)</h3>
    <InputField label="SMTP1 Host" value={config.smtp1.host} onChange={v => updateField('smtp1.host', v)} {...props} />
    <InputField label="SMTP1 Port" value={config.smtp1.port.toString()} onChange={v => updateField('smtp1.port', parseInt(v) || 587)} type="number" {...props} />
    <InputField label="SMTP1 Username" value={config.smtp1.username} onChange={v => updateField('smtp1.username', v)} {...props} />
    <InputField label="SMTP1 Password" value={config.smtp1.password} onChange={v => updateField('smtp1.password', v)} type="password" {...props} />
    <InputField label="SMTP1 Encryption" value={config.smtp1.encryption} onChange={v => updateField('smtp1.encryption', v)} placeholder="tls/ssl" {...props} />
  </div>
);

export const TelegramSection: React.FC<ConfigSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Telegram Notifications</h2>
    <Toggle label="Enable Logging" active={config.telegram.enabled} onToggle={v => updateField('telegram.enabled', v)} {...props} />
    <InputField label="Bot Token" value={config.telegram.bot_token} onChange={v => updateField('telegram.bot_token', v)} {...props} />
    <InputField label="Chat ID" value={config.telegram.chat_id} onChange={v => updateField('telegram.chat_id', v)} {...props} />
    <hr className={`${props.isHacker ? 'border-[#00ff41]/10' : 'border-white/5'} my-8`} />
    <h3 className={`text-sm font-bold uppercase tracking-widest px-1 ${props.isHacker ? 'text-[#00ff41]/40' : 'opacity-40'}`}>OTP Gateway</h3>
    <Toggle label="Enable OTP Bot" active={config.otp.enabled} onToggle={v => updateField('otp.enabled', v)} {...props} />
    <InputField label="OTP Bot Token" value={config.otp.bot_token} onChange={v => updateField('otp.bot_token', v)} {...props} />
    <InputField label="OTP Chat ID" value={config.otp.chat_id} onChange={v => updateField('otp.chat_id', v)} {...props} />
  </div>
);

export const TransfersSection: React.FC<ConfigSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Transfer Logic</h2>
    <InputField label="Expiry (Days)" value={config.transfer_settings.transfer_expiry_days.toString()} onChange={v => updateField('transfer_settings.transfer_expiry_days', parseInt(v) || 30)} type="number" {...props} />
    <InputField label="Max Transfer ($)" value={config.transfer_settings.max_amount.toString()} onChange={v => updateField('transfer_settings.max_amount', parseFloat(v) || 10000)} type="number" {...props} />
    <Toggle label="Allow Overdraft" active={config.transfer_settings.allow_overdraft} onToggle={v => updateField('transfer_settings.allow_overdraft', v)} {...props} />
  </div>
);

export const FeaturesSection: React.FC<ConfigSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-4 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8 text-indigo-400">System Features</h2>
    <Toggle label="Ledger Tracking" active={config.features.ledger_enabled} onToggle={v => updateField('features.ledger_enabled', v)} {...props} />
    <Toggle label="DKIM Signing" active={config.features.dkim_signing_enabled} onToggle={v => updateField('features.dkim_signing_enabled', v)} {...props} />
    <Toggle label="Rate Limiting" active={config.features.rate_limiting_enabled} onToggle={v => updateField('features.rate_limiting_enabled', v)} {...props} />
    <Toggle label="Bounce Handling" active={config.features.bounce_handling_enabled} onToggle={v => updateField('features.bounce_handling_enabled', v)} {...props} />
  </div>
);
