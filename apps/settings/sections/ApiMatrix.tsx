import React, { useState, useEffect } from 'react';

export const ApiMatrixSection: React.FC<{ isDark: boolean; isHacker: boolean }> = ({ isDark, isHacker }) => {
    const [status, setStatus] = useState<any>(null);
    useEffect(() => {
        fetch('/api/status').then(r => r.json()).then(setStatus).catch(() => {});
    }, []);

    return (
        <div className="space-y-6 animate-in slide-up">
            <h2 className="text-2xl font-bold mb-8">Neural Matrix Registry</h2>
            <div className="bg-zinc-900/60 p-6 rounded-[32px] border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-zinc-400">Core Status</span>
                    <span className="text-emerald-500 font-black uppercase text-xs tracking-widest">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-zinc-400">Uplinks Detected</span>
                    <span className="text-white font-black text-lg">{status?.uplinks || 'Syncing...'}</span>
                </div>
            </div>
        </div>
    );
};