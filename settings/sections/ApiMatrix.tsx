
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Uplink {
    id: number;
    masked_key: string;
    available: boolean;
    errors: number;
    last_used: number;
}

interface ApiMatrixSectionProps {
    isDark: boolean;
    isHacker: boolean;
}

export const ApiMatrixSection: React.FC<ApiMatrixSectionProps> = ({ isDark, isHacker }) => {
    const [uplinks, setUplinks] = useState<Uplink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/status');
            
            // Check content type before parsing JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                throw new Error(`Invalid server response (Non-JSON). This usually means the backend crashed or returned an error page.`);
            }

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || `System error: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.uplinks) {
                setUplinks(data.uplinks);
            }
        } catch (e: any) {
            console.error("Failed to sync with API Matrix:", e);
            setError(e.message || "Failed to establish telemetry link with neural matrix.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    if (isLoading && uplinks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Scanning Neural Matrix...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-up">
            {/* Header Metrics */}
            <div className="grid grid-cols-2 gap-3">
                <div className={`p-5 rounded-[28px] ${isDark ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">Total Uplinks</p>
                    <p className="text-2xl font-black">{uplinks.length}</p>
                </div>
                <div className={`p-5 rounded-[28px] ${isDark ? 'bg-[#1c1c1e]' : 'bg-white shadow-sm'}`}>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Operational</p>
                    <p className="text-2xl font-black">{uplinks.filter(u => u.available).length}</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl animate-in fade-in">
                    <p className="text-orange-500 text-[10px] font-bold uppercase mb-1">Sync Warning</p>
                    <p className="text-orange-500/70 text-xs font-medium leading-relaxed">{error}</p>
                </div>
            )}

            {/* Matrix List */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                    <h3 className={`text-[11px] font-black uppercase tracking-widest ${isHacker ? 'text-[#00ff41]/40' : 'text-gray-400'}`}>Uplink Registry</h3>
                    <button 
                        onClick={fetchData} 
                        disabled={isLoading}
                        className={`text-[10px] font-bold text-indigo-500 uppercase ${isLoading ? 'opacity-30' : 'active:scale-95 transition-transform'}`}
                    >
                        {isLoading ? 'Syncing...' : 'Refresh'}
                    </button>
                </div>

                <div className={`rounded-[28px] overflow-hidden border border-transparent shadow-sm ${isDark ? 'bg-[#1c1c1e]' : 'bg-white'}`}>
                    {uplinks.map((u, idx) => (
                        <div key={u.id} className={`p-5 flex items-center justify-between ${idx !== 0 ? 'border-t border-gray-100/10' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${u.available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
                                <div className="min-w-0">
                                    <p className="font-mono text-sm font-bold tracking-tight">{u.masked_key}</p>
                                    <p className="text-[10px] font-medium opacity-40 uppercase tracking-tighter">
                                        ID: {u.id} • Errors: {u.errors} • {u.last_used > 0 ? `Active ${Math.round((Date.now()/1000 - u.last_used)/60)}m ago` : 'Standby'}
                                    </p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.available ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {u.available ? 'Valid' : 'Invalid'}
                            </div>
                        </div>
                    ))}
                    {!isLoading && uplinks.length === 0 && (
                        <div className="p-10 text-center text-xs opacity-40 uppercase font-black tracking-widest">No keys detected in pool</div>
                    )}
                </div>
            </div>

            {/* Health Warnings */}
            {uplinks.some(u => !u.available) && (
                <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-[28px] flex items-start gap-4 animate-in slide-up">
                    <div className="p-2 bg-red-500 rounded-full text-white shrink-0 shadow-lg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <div>
                        <p className="text-red-500 font-bold text-sm uppercase tracking-tight">Blackout Detected</p>
                        <p className="text-red-500/60 text-xs mt-1 leading-relaxed">Some neural links have been severed due to high entropy or rate limiting. Key rotation recommended.</p>
                    </div>
                </div>
            )}
        </div>
    );
};
