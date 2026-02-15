
import React from 'react';
import { SystemConfig } from '../../../../data/systemConfig';
import { Toggle, InputField, CommonFieldProps } from '../../components/Shared';

interface AppearanceProps extends CommonFieldProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
}

export const AppearanceSection: React.FC<AppearanceProps> = ({ config, updateField, ...props }) => (
  <div className="space-y-6 animate-in slide-up">
    <h2 className="text-2xl font-bold mb-8">Display & Sound</h2>
    
    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Screen</h3>
        <Toggle label="Dark Mode" active={config.display_options.dark_mode} onToggle={v => updateField('display_options.dark_mode', v)} {...props} />
        <Toggle label="Adaptive Brightness" active={config.display_options.adaptive_brightness} onToggle={v => updateField('display_options.adaptive_brightness', v)} {...props} />
        <Toggle label="Night Light" active={config.display_options.night_light_enabled} onToggle={v => updateField('display_options.night_light_enabled', v)} {...props} />
        <InputField label="Refresh Rate (Hz)" value={config.display_options.refresh_rate_hz.toString()} onChange={v => updateField('display_options.refresh_rate_hz', parseInt(v) || 60)} type="number" {...props} />
        <InputField label="Wallpaper URL" value={config.display_options.wallpaper_url} onChange={v => updateField('display_options.wallpaper_url', v)} {...props} />
    </div>

    <hr className="border-white/10" />

    <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Audio</h3>
        <InputField label="Media Volume" value={config.sound_vibration.media_volume.toString()} onChange={v => updateField('sound_vibration.media_volume', parseInt(v) || 50)} type="range" min="0" max="100" {...props} />
        <Toggle label="Vibration" active={config.sound_vibration.vibration_enabled} onToggle={v => updateField('sound_vibration.vibration_enabled', v)} {...props} />
        <Toggle label="Do Not Disturb" active={config.sound_vibration.do_not_disturb_enabled} onToggle={v => updateField('sound_vibration.do_not_disturb_enabled', v)} {...props} />
    </div>
  </div>
);
