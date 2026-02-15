import React from 'react';
import { SystemConfig } from '../../../../data/systemConfig.ts';
import { InfoField, CommonFieldProps } from '../../components/Shared.tsx';

export const SystemInfoSection: React.FC<{ config: SystemConfig; updateField: any } & CommonFieldProps> = ({ config, updateField, ...props }) => (
    <div className="space-y-6 animate-in slide-up">
        <h2 className="text-2xl font-bold mb-8">Module Status</h2>
        <InfoField label="Model Name" value={config.about_phone.model_name} {...props} />
        <InfoField label="Kernel Version" value={config.about_phone.kernel_version} {...props} />
        <InfoField label="Uptime" value={`${config.about_phone.uptime_days} cycles`} {...props} />
    </div>
);