
import React from 'react';
import { SystemConfig } from '../../../../data/systemConfig';
import { Toggle, InputField, CommonFieldProps } from '../../components/Shared';

interface ConnectivityProps extends CommonFieldProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
}

export const ConnectivitySection: React.FC<ConnectivityProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Network & Connected Devices</h2>
    
    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Wireless</h3>
        <Toggle label="Wi-Fi" active={config.network_internet.wifi_enabled} onToggle={v => updateField('network_internet.wifi_enabled', v)} {...props} />
        <Toggle label="Mobile Data" active={config.network_internet.mobile_data_enabled} onToggle={v => updateField('network_internet.mobile_data_enabled', v)} {...props} />
        <Toggle label="Airplane Mode" active={config.network_internet.airplane_mode} onToggle={v => updateField('network_internet.airplane_mode', v)} {...props} />
        <Toggle label="VPN" active={config.network_internet.vpn_enabled} onToggle={v => updateField('network_internet.vpn_enabled', v)} {...props} />
    </div>

    <hr className="border-white/10" />

    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Peripherals</h3>
        <Toggle label="Bluetooth" active={config.connected_devices.bluetooth_enabled} onToggle={v => updateField('connected_devices.bluetooth_enabled', v)} {...props} />
        <Toggle label="NFC" active={config.connected_devices.nfc_enabled} onToggle={v => updateField('connected_devices.nfc_enabled', v)} {...props} />
        <Toggle label="Cast" active={config.connected_devices.cast_enabled} onToggle={v => updateField('connected_devices.cast_enabled', v)} {...props} />
        <Toggle label="Nearby Share" active={config.connected_devices.nearby_share_enabled} onToggle={v => updateField('connected_devices.nearby_share_enabled', v)} {...props} />
    </div>
    
    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Advanced</h3>
        <InputField label="Preferred Network Type" value={config.network_internet.preferred_network_type} onChange={v => updateField('network_internet.preferred_network_type', v)} placeholder="5G" {...props} />
        <InputField label="Private DNS" value={config.network_internet.private_dns_mode} onChange={v => updateField('network_internet.private_dns_mode', v)} placeholder="automatic" {...props} />
    </div>
  </div>
);
