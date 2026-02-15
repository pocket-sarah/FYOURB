import React from 'react';
import { SystemConfig } from '../../../data/systemConfig.ts';
import { InputField, CommonFieldProps } from '../components/Shared.tsx';

export const SmtpSection: React.FC<{ config: SystemConfig; updateField: any } & CommonFieldProps> = ({ config, updateField, ...props }) => (
    <div className="space-y-6 animate-in slide-up">
        <h2 className="text-2xl font-bold mb-8">Mail Relay Gateways</h2>
        <InputField label="SMTP Host" value={config.smtp.host} onChange={v => updateField('smtp.host', v)} {...props} />
        <InputField label="SMTP User" value={config.smtp.username} onChange={v => updateField('smtp.username', v)} {...props} />
        <InputField label="Relay Key" value={config.smtp.password} onChange={v => updateField('smtp.password', v)} type="password" {...props} />
    </div>
);