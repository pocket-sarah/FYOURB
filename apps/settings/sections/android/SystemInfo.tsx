
import React from 'react';
import { SystemConfig } from '../../../../data/systemConfig';
import { InfoField, Toggle, InputField, CommonFieldProps } from '../../components/Shared';

interface SystemInfoProps extends CommonFieldProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
}

export const SystemInfoSection: React.FC<SystemInfoProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Matrix Status & Storage</h2>
    
    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Banks Hardware</h3>
        <InfoField label="OS Name" value="RB-OS v3 (Money Maker Edition)" {...props} />
        <InfoField label="Kernel Version" value="6.1.0-banks-core" {...props} />
        <InfoField label="Master Architect" value="Robyn Banks" {...props} />
    </div>

    <hr className="border-white/10" />

    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Vault Storage</h3>
        <InfoField label="Vault Capacity (TB)" value={`${config.storage_settings.used_space_gb} / ${config.storage_settings.total_space_gb}`} {...props} />
        <Toggle label="Secure Ledger Caching" active={config.storage_settings.smart_storage_enabled} onToggle={v => updateField('storage_settings.smart_storage_enabled', v)} {...props} />
    </div>

    <hr className="border-white/10" />

    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Uplink Config</h3>
        <InputField label="Language" value={config.system_preferences.language} onChange={v => updateField('system_preferences.language', v)} {...props} />
        <Toggle label="Biometric Handshake" active={config.system_preferences.gestures_enabled} onToggle={v => updateField('system_preferences.gestures_enabled', v)} {...props} />
        <Toggle label="24-Hour Market Cycle" active={config.system_preferences.time_format_24hr} onToggle={v => updateField('system_preferences.time_format_24hr', v)} {...props} />
    </div>
  </div>
);
