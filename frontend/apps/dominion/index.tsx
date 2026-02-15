
import React, { useState, useEffect } from 'react';
import { BankApp } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Cpu, Activity, Info, Network, Globe, Lock } from 'lucide-react';
import { GeminiService } from '../../services/gemini';
import AppLayout from '../shared/layouts/AppLayout';

const MotionDiv = motion.div as any;

const DominionApp: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [integrity, setIntegrity] = useState(100);
    const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
    const [activeModules, setActiveModules] = useState(['Firewall', 'Satellite', 'Ledger']);

    const runDiagnostic = async () => {
        setIsDiagnosticRunning(true);
        const report = await GeminiService.generateText("Provide a 1-sentence technical status report for a futuristic OS kernel.");
        onNotify("Diagnostic Complete", report, app.icon);
        setTimeout(() => setIsDiagnosticRunning(false), 3000);
    };

    return (
        <AppLayout brandColor="#ff003c" onClose={onClose} title="DOMINION CORE v27">
            <div className="flex flex-col h-full bg-[#050505] text-indigo-400 font-mono overflow-hidden">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10">
                    
                    {/* Status Ring Module */}
                    <div className="relative flex flex-col items-center justify-center py-10">
                        <div className="w-56 h-56 rounded-full border-4 border-indigo-500/10 flex items-center justify-center relative">
                            <MotionDiv 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-indigo-500/40 border-t-transparent rounded-full"
                            />
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase text-indigo-500/60 mb-1">System Integrity</p>
                                <h1 className="text-5xl font-black text-white">{integrity}%</h1>
                            </div>
                        </div>
                    </div>

                    {/* Tactics Matrix */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: 'Grid Pulse', icon: Network, color: 'text-indigo-400' },
                            { name: 'Satellite lock', icon: Globe, color: 'text-sky-400' },
                            { name: 'Neural shield', icon: Shield, color: 'text-emerald-400' },
                            { name: 'Entropy sweep', icon: Activity, color: 'text-rose-400' }
                        ].map((m, i) => (
                            <button key={i} className="bg-zinc-900/60 border border-white/5 p-6 rounded-[32px] flex flex-col items-center gap-4 active:scale-95 transition-all">
                                <m.icon size={24} className={m.color} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{m.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Diagnostic Module */}
                    <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[40px] flex flex-col gap-6">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1">Core Diagnostic</h3>
                            <p className="text-indigo-400/60 text-xs">Verify kernel stability and matrix health.</p>
                        </div>
                        <button 
                            onClick={runDiagnostic}
                            disabled={isDiagnosticRunning}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {isDiagnosticRunning ? 'PROBING KERNEL...' : 'INITIATE_HANDSHAKE'}
                        </button>
                    </div>

                    {/* Active Registry */}
                    <div className="space-y-4">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2">Active Protocols</h3>
                         <div className="bg-black/40 border border-white/5 rounded-[32px] overflow-hidden divide-y divide-white/5">
                             {activeModules.map(m => (
                                 <div key={m} className="p-5 flex justify-between items-center">
                                     <span className="text-sm font-bold text-white/80">{m} Node</span>
                                     <div className="flex items-center gap-2">
                                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                                         <span className="text-[10px] font-black text-emerald-500 uppercase">Stable</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>

                {/* Footer Telemetry */}
                <div className="h-10 bg-indigo-600/10 border-t border-white/5 flex items-center px-6 justify-between shrink-0">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Uplink: Synchronized</span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Matrix: v99.Ω</span>
                </div>
            </div>
        </AppLayout>
    );
};

export default DominionApp;
