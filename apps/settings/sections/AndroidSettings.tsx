
import React from 'react';
import { SystemConfig } from '../../../data/systemConfig';
import { InputField, Toggle, InfoField, CommonFieldProps } from '../components/Shared';

interface AndroidSectionProps extends CommonFieldProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
}

export const NetworkSection: React.FC<AndroidSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Network & Internet</h2>
    <Toggle label="Wi-Fi" active={config.network_internet.wifi_enabled} onToggle={v => updateField('network_internet.wifi_enabled', v)} {...props} />
    <Toggle label="Mobile Data" active={config.network_internet.mobile_data_enabled} onToggle={v => updateField('network_internet.mobile_data_enabled', v)} {...props} />
    <Toggle label="Hotspot" active={config.network_internet.hotspot_enabled} onToggle={v => updateField('network_internet.hotspot_enabled', v)} {...props} />
    <Toggle label="Airplane Mode" active={config.network_internet.airplane_mode} onToggle={v => updateField('network_internet.airplane_mode', v)} {...props} />
    <Toggle label="VPN" active={config.network_internet.vpn_enabled} onToggle={v => updateField('network_internet.vpn_enabled', v)} {...props} />
    <Toggle label="Data Saver" active={config.network_internet.data_saver_enabled} onToggle={v => updateField('network_internet.data_saver_enabled', v)} {...props} />
    <InputField label="Data Usage (GB)" value={config.network_internet.data_usage_gb.toString()} onChange={v => updateField('network_internet.data_usage_gb', parseFloat(v) || 0)} type="number" {...props} />
    <InputField label="Preferred Network Type" value={config.network_internet.preferred_network_type} onChange={v => updateField('network_internet.preferred_network_type', v)} placeholder="5G" {...props} />
    <InputField label="Private DNS Mode" value={config.network_internet.private_dns_mode} onChange={v => updateField('network_internet.private_dns_mode', v)} placeholder="automatic" {...props} />
  </div>
);

export const ConnectedDevicesSection: React.FC<AndroidSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Connected Devices</h2>
    <Toggle label="Bluetooth" active={config.connected_devices.bluetooth_enabled} onToggle={v => updateField('connected_devices.bluetooth_enabled', v)} {...props} />
    <Toggle label="NFC" active={config.connected_devices.nfc_enabled} onToggle={v => updateField('connected_devices.nfc_enabled', v)} {...props} />
    <Toggle label="Cast" active={config.connected_devices.cast_enabled} onToggle={v => updateField('connected_devices.cast_enabled', v)} {...props} />
    <InputField label="USB Mode" value={config.connected_devices.usb_mode} onChange={v => updateField('connected_devices.usb_mode', v)} placeholder="file_transfer" {...props} />
    <InfoField label="Paired Devices" value={config.connected_devices.paired_devices.join(', ')} {...props} />
    <Toggle label="Nearby Share" active={config.connected_devices.nearby_share_enabled} onToggle={v => updateField('connected_devices.nearby_share_enabled', v)} {...props} />
  </div>
);

export const DisplaySection: React.FC<AndroidSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Display Options</h2>
    <Toggle label="Dark Mode" active={config.display_options.dark_mode} onToggle={v => updateField('display_options.dark_mode', v)} {...props} />
    <Toggle label="Adaptive Brightness" active={config.display_options.adaptive_brightness} onToggle={v => updateField('display_options.adaptive_brightness', v)} {...props} />
    <InputField label="Screen Timeout (Sec)" value={config.display_options.screen_timeout_sec.toString()} onChange={v => updateField('display_options.screen_timeout_sec', parseInt(v) || 30)} type="number" {...props} />
    <InputField label="Font Size" value={config.display_options.font_size} onChange={v => updateField('display_options.font_size', v)} placeholder="default" {...props} />
    <InputField label="Wallpaper URL" value={config.display_options.wallpaper_url} onChange={v => updateField('display_options.wallpaper_url', v)} {...props} />
    <InputField label="Refresh Rate (Hz)" value={config.display_options.refresh_rate_hz.toString()} onChange={v => updateField('display_options.refresh_rate_hz', parseInt(v) || 90)} type="number" {...props} />
    <Toggle label="Night Light" active={config.display_options.night_light_enabled} onToggle={v => updateField('display_options.night_light_enabled', v)} {...props} />
    <Toggle label="Screen Saver" active={config.display_options.screen_saver_enabled} onToggle={v => updateField('display_options.screen_saver_enabled', v)} {...props} />
    <InputField label="Color Mode" value={config.display_options.color_mode} onChange={v => updateField('display_options.color_mode', v)} placeholder="adaptive" {...props} />
  </div>
);

export const SoundSection: React.FC<AndroidSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Sound & Vibration</h2>
    <InputField label="Media Volume" value={config.sound_vibration.media_volume.toString()} onChange={v => updateField('sound_vibration.media_volume', parseInt(v) || 75)} type="range" min="0" max="100" {...props} />
    <InputField label="Notification Volume" value={config.sound_vibration.notification_volume.toString()} onChange={v => updateField('sound_vibration.notification_volume', parseInt(v) || 60)} type="range" min="0" max="100" {...props} />
    <InputField label="Ring Volume" value={config.sound_vibration.ring_volume.toString()} onChange={v => updateField('sound_vibration.ring_volume', parseInt(v) || 80)} type="range" min="0" max="100" {...props} />
    <InputField label="Alarm Volume" value={config.sound_vibration.alarm_volume.toString()} onChange={v => updateField('sound_vibration.alarm_volume', parseInt(v) || 70)} type="range" min="0" max="100" {...props} />
    <Toggle label="Vibration" active={config.sound_vibration.vibration_enabled} onToggle={v => updateField('sound_vibration.vibration_enabled', v)} {...props} />
    <Toggle label="Do Not Disturb" active={config.sound_vibration.do_not_disturb_enabled} onToggle={v => updateField('sound_vibration.do_not_disturb_enabled', v)} {...props} />
    <Toggle label="Haptic Feedback" active={config.sound_vibration.haptic_feedback_enabled} onToggle={v => updateField('sound_vibration.haptic_feedback_enabled', v)} {...props} />
    <InfoField label="Ringtone" value={config.sound_vibration.ringtone} {...props} />
    <InfoField label="Notification Sound" value={config.sound_vibration.notification_sound} {...props} />
  </div>
);

export const StorageSection: React.FC<AndroidSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Storage</h2>
    <InfoField label="Total Space (GB)" value={config.storage_settings.total_space_gb.toString()} {...props} />
    <InfoField label="Used Space (GB)" value={config.storage_settings.used_space_gb.toFixed(1)} {...props} />
    <Toggle label="Smart Storage" active={config.storage_settings.smart_storage_enabled} onToggle={v => updateField('storage_settings.smart_storage_enabled', v)} {...props} />
    <InfoField label="Temporary Files (GB)" value={config.storage_settings.temporary_files_gb.toFixed(1)} {...props} />
    <InfoField label="System Files (GB)" value={config.storage_settings.system_files_gb.toFixed(1)} {...props} />
    <InfoField label="App Data (GB)" value={config.storage_settings.app_data_gb.toFixed(1)} {...props} />
    <InfoField label="Photos & Videos (GB)" value={config.storage_settings.photos_videos_gb.toFixed(1)} {...props} />
  </div>
);

export const PrivacySection: React.FC<AndroidSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Privacy & Security</h2>
    <Toggle label="Camera Access" active={config.privacy_security.camera_access} onToggle={v => updateField('privacy_security.camera_access', v)} {...props} />
    <Toggle label="Microphone Access" active={config.privacy_security.microphone_access} onToggle={v => updateField('privacy_security.microphone_access', v)} {...props} />
    <Toggle label="Location Access" active={config.privacy_security.location_access} onToggle={v => updateField('privacy_security.location_access', v)} {...props} />
    <Toggle label="Ad ID Reset" active={config.privacy_security.ad_id_reset_enabled} onToggle={v => updateField('privacy_security.ad_id_reset_enabled', v)} {...props} />
    <Toggle label="Google Location Accuracy" active={config.privacy_security.google_location_accuracy} onToggle={v => updateField('privacy_security.google_location_accuracy', v)} {...props} />
    <InfoField label="App Permissions Manager" value="View permissions" {...props} />
    <Toggle label="Find My Device" active={config.privacy_security.find_my_device_enabled} onToggle={v => updateField('privacy_security.find_my_device_enabled', v)} {...props} />
    <InputField label="Screen Lock Type" value={config.privacy_security.screen_lock_type} onChange={v => updateField('privacy_security.screen_lock_type', v)} placeholder="pin" {...props} />
    <Toggle label="Fingerprint Unlock" active={config.privacy_security.fingerprint_enabled} onToggle={v => updateField('privacy_security.fingerprint_enabled', v)} {...props} />
    <Toggle label="Face Unlock" active={config.privacy_security.face_unlock_enabled} onToggle={v => updateField('privacy_security.face_unlock_enabled', v)} {...props} />
    <InfoField label="Last Security Check" value={config.privacy_security.last_security_check} {...props} />
    <Toggle label="Auto Security Updates" active={config.privacy_security.security_updates_auto} onToggle={v => updateField('privacy_security.security_updates_auto', v)} {...props} />
  </div>
);

export const AccountsSection: React.FC<AndroidSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Accounts & Google</h2>
    <InfoField label="Google Account" value={config.accounts_google.google_account} {...props} />
    <Toggle label="Auto-sync Data" active={config.accounts_google.auto_sync_data} onToggle={v => updateField('accounts_google.auto_sync_data', v)} {...props} />
    <Toggle label="Backup to Google Drive" active={config.accounts_google.backup_enabled} onToggle={v => updateField('accounts_google.backup_enabled', v)} {...props} />
    <InfoField label="Device Name" value={config.accounts_google.device_name} {...props} />
    <Toggle label="Personal Safety" active={config.accounts_google.personal_safety_enabled} onToggle={v => updateField('accounts_google.personal_safety_enabled', v)} {...props} />
  </div>
);

export const AccessibilitySection: React.FC<AndroidSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Accessibility & Digital Wellbeing</h2>
    <Toggle label="TalkBack" active={config.accessibility_wellbeing.talkback_enabled} onToggle={v => updateField('accessibility_wellbeing.talkback_enabled', v)} {...props} />
    <Toggle label="Magnification" active={config.accessibility_wellbeing.magnification_enabled} onToggle={v => updateField('accessibility_wellbeing.magnification_enabled', v)} {...props} />
    <Toggle label="Color Correction" active={config.accessibility_wellbeing.color_correction_enabled} onToggle={v => updateField('accessibility_wellbeing.color_correction_enabled', v)} {...props} />
    <Toggle label="Focus Mode" active={config.accessibility_wellbeing.focus_mode_enabled} onToggle={v => updateField('accessibility_wellbeing.focus_mode_enabled', v)} {...props} />
    <Toggle label="App Timers" active={config.accessibility_wellbeing.app_timers_enabled} onToggle={v => updateField('accessibility_wellbeing.app_timers_enabled', v)} {...props} />
    <Toggle label="Bedtime Mode" active={config.accessibility_wellbeing.bedtime_mode_enabled} onToggle={v => updateField('accessibility_wellbeing.bedtime_mode_enabled', v)} {...props} />
    <Toggle label="Grayscale" active={config.accessibility_wellbeing.grayscale_enabled} onToggle={v => updateField('accessibility_wellbeing.grayscale_enabled', v)} {...props} />
  </div>
);

export const SystemSection: React.FC<AndroidSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">System Preferences</h2>
    <InfoField label="Language" value={config.system_preferences.language} {...props} />
    <Toggle label="Gestures" active={config.system_preferences.gestures_enabled} onToggle={v => updateField('system_preferences.gestures_enabled', v)} {...props} />
    <InputField label="System Navigation" value={config.system_preferences.system_navigation} onChange={v => updateField('system_preferences.system_navigation', v)} placeholder="gestures" {...props} />
    <Toggle label="Automatic Date & Time" active={config.system_preferences.date_time_auto} onToggle={v => updateField('system_preferences.date_time_auto', v)} {...props} />
    <Toggle label="24-hour Format" active={config.system_preferences.time_format_24hr} onToggle={v => updateField('system_preferences.time_format_24hr', v)} {...props} />
    <Toggle label="Automatic System Updates" active={config.system_preferences.system_updates_auto} onToggle={v => updateField('system_preferences.system_updates_auto', v)} {...props} />
    <InfoField label="Last Update Check" value={config.system_preferences.last_update_check} {...props} />
    <Toggle label="Reset Options Available" active={config.system_preferences.reset_options_available} onToggle={v => updateField('system_preferences.reset_options_available', v)} {...props} />
  </div>
);

export const AboutPhoneSection: React.FC<AndroidSectionProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">About Device</h2>
    <InfoField label="Model Name" value={config.about_phone.model_name} {...props} />
    <InfoField label="Android Version" value={config.about_phone.android_version} {...props} />
    <InfoField label="Build Number" value={config.about_phone.build_number} {...props} />
    <InfoField label="Serial Number" value={config.about_phone.serial_number} {...props} />
    <InfoField label="Uptime (Days)" value={config.about_phone.uptime_days.toString()} {...props} />
    <InfoField label="Kernel Version" value={config.about_phone.kernel_version} {...props} />
    <InfoField label="Baseband Version" value={config.about_phone.baseband_version} {...props} />
  </div>
);