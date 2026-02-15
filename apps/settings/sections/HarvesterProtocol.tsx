import React, { useState } from 'react';
import { Toggle, InputField, CommonFieldProps } from '../components/Shared';
import { SystemConfig } from '../../../data/systemConfig';
import { Github, ShieldCheck, Zap } from 'lucide-react';

interface HarvesterSectionProps extends CommonFieldProps {
  config: SystemConfig;
  updateField: (path: string, value: any) => void;
}

export const HarvesterProtocol: React.FC<HarvesterSectionProps> = ({ config, updateField, ...props }) => {
    return (
        <div className="space-y-6 animate-in slide-up pb-20">
            <h2 className="text-2xl font-bold mb-8">Harvester HP-99 Config</h2>
            
            <div className="bg-zinc-900/60 rounded-[32px] p-8 border border-white/5 space-y-8">
                {/* GitHub Uplink */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <Github size={20} className="text-white" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-white/60">GitHub Recon Matrix</h3>
                    </div>
                    <InputField 
                        label="Personal Access Token (PAT)" 
                        value={(config as any).github_pat || ''} 
                        onChange={v => updateField('github_pat', v)} 
                        type="password"
                        placeholder="ghp_*******************"
                        {...props} 
                    />
                    <Toggle 
                        label="Scrape Gists & Repos" 
                        active={(config as any).github_recon_enabled ?? true} 
                        onToggle={v => updateField('github_recon_enabled', v)}
                        {...props}
                    />
                    <Toggle 
                        label="Deep Search Depth" 
                        active={(config as any).github_deep_search ?? false} 
                        onToggle={v => updateField('github_deep_search', v)}
                        accentColor="bg-purple-600"
                        {...props}
                    />
                </div>

                <hr className="border-white/5" />

                {/* Core Engine */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                        <Zap size={20} className="text-indigo-400" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400/60">Neural Engine</h3>
                    </div>
                    <Toggle label="Auto-test Found Ciphers" active={(config as any).auto_test_ciphers ?? true} onToggle={v => updateField('auto_test_ciphers', v)} {...props} />
                    <Toggle label="Stealth Mode (Cloaked)" active={(config as any).stealth_mode ?? true} onToggle={v => updateField('stealth_mode', v)} {...props} />
                </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[28px] flex gap-5 items-start">
                <ShieldCheck size={28} className="text-emerald-500 shrink-0" />
                <div>
                    <h4 className="text-emerald-500 font-bold text-sm uppercase tracking-tight">Handshake Verified</h4>
                    <p className="text-emerald-500/60 text-xs mt-1 leading-relaxed font-medium">Harvester is using authorized research headers. All discovered data fragments are logged to the local evidence vault for research purposes.</p>
                </div>
            </div>
        </div>
    );
};