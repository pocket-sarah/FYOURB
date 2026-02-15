import React from 'react';
import { SystemConfig } from '../../../../data/systemConfig.ts';
import { Toggle, CommonFieldProps } from '../../components/Shared.tsx';

export const ConnectivitySection: React.FC<{ config: SystemConfig; updateField: any } & CommonFieldProps> = ({ config, updateField, ...props }) => (
    <div className="space-y-6 animate-in slide-up">
        <h2 className="text-2xl font-bold mb-8">Neural Uplinks</h2>
        <Toggle label="Wi-Fi" active={config.network_internet.wifi_enabled} onToggle={v => updateField('network_internet.wifi_enabled', v)} {...props} />
        <Toggle label="Bluetooth" active={config.connected_devices.bluetooth_enabled} onToggle={v => updateField('connected_devices.bluetooth_enabled', v)} {...props} />
        <Toggle label="Airplane Mode" active={config.network_internet.airplane_mode} onToggle={v => updateField('network_internet.airplane_mode', v)} {...props} />
    </div>
);