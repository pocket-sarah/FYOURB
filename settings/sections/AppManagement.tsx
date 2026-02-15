import React from 'react';
import { BankApp } from '../../../types';

interface AppManagementProps {
    apps: BankApp[];
    onUninstall: (id: string) => void;
    isDark: boolean;
}

export const AppManagementSection: React.FC<AppManagementProps> = ({ apps, onUninstall, isDark }) => {
    const installedApps = apps.filter(a => a.isInstalled);

    return (
        <div className="space-y-4 animate-in slide-up">
            <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest px-2 mb-4">Installed Modules ({installedApps.length})</p>
            <div className={`rounded-[28px] overflow-hidden border border-transparent ${isDark ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                {installedApps.map((app, idx) => (
                    <div key={app.id} className={`p-4 flex items-center justify-between ${idx !== 0 ? 'border-t border-gray-100/10' : ''}`}>
                        <div className="flex items-center gap-4">
                            <img src={app.icon} className="w-10 h-10 rounded-xl object-cover" alt="" />
                            <div>
                                <p className="font-bold text-[14px]">{app.name}</p>
                                <p className="text-[10px] opacity-40 uppercase font-black">{app.category}</p>
                            </div>
                        </div>
                        {app.id !== 'settings' && (
                            <button 
                                onClick={() => onUninstall(app.id)}
                                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/20 transition-all"
                            >
                                Purge
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};