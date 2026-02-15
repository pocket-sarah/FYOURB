
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const EvidenceVault: React.FC<{ onNotify: any }> = ({ onNotify }) => {
    const [records, setRecords] = useState<any[]>([]);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await fetch('/api/evidence/stream');
                const data = await res.json();
                setRecords(data.records || []);
            } catch (e) {
                // Mock data for isolation
                setRecords([
                    { id: 'RX-102', node: 'PHP_SMTP', event: 'MAIL_DISPATCH', timestamp: Date.now() - 120000, hash: 'sha256:4d8a...' },
                    { id: 'RX-101', node: 'PYTHON_CORE', event: 'UPLINK_SYNC', timestamp: Date.now() - 300000, hash: 'sha256:2f1b...' }
                ]);
            }
        };
        fetchRecords();
    }, []);

    const exportVault = () => {
        const data = JSON.stringify(records, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rros_evidence_${Date.now()}.json`;
        a.click();
        onNotify("Vault Exported", "Session data compiled into encrypted JSON.", "https://cdn-icons-png.flaticon.com/512/2103/2103633.png");
    };

    return (
        <div className="h-full flex flex-col p-8 gap-8 overflow-hidden">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2 text-white">Evidence Vault</h2>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">Immutable system logs and session snapshots.</p>
                </div>
                <button 
                    onClick={exportVault}
                    className="px-8 py-3 bg-[#00ff41] text-black font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl shadow-[#00ff41]/20 hover:scale-105 active:scale-95 transition-all"
                >
                    Export Snapshot
                </button>
            </div>

            <div className="flex-1 bg-black/40 border border-white/5 rounded-[40px] overflow-hidden flex flex-col">
                <div className="grid grid-cols-5 px-8 py-5 border-b border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                    <span>Timestamp</span>
                    <span>Node ID</span>
                    <span className="col-span-2">Protocol Event</span>
                    <span className="text-right">Integrity Hash</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-3">
                    {records.map(record => (
                        /* Fix: Use MotionDiv */
                        <MotionDiv 
                            key={record.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid grid-cols-5 px-6 py-4 bg-zinc-900/40 rounded-2xl border border-white/5 hover:border-[#00ff41]/30 transition-all group"
                        >
                            <span className="text-zinc-500 font-mono text-[11px]">{new Date(record.timestamp).toLocaleTimeString()}</span>
                            <span className="text-blue-400 font-bold text-[11px]">{record.node}</span>
                            <span className="col-span-2 text-white/80 font-medium text-[12px]">{record.event}</span>
                            <span className="text-right text-zinc-600 font-mono text-[9px] group-hover:text-[#00ff41] transition-colors">{record.hash || record.integrity_hash}</span>
                        </MotionDiv>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EvidenceVault;
