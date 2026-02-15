
import React, { useState } from 'react';
import { BankApp } from '../../types';
import { motion } from 'framer-motion';
import { Shield, Zap, Cpu, Activity, Network, Globe, Lock, RefreshCw } from 'lucide-react';
import { GeminiService } from '../../services/gemini';
import AppLayout from '../shared/layouts/AppLayout';

const MotionDiv = motion.div as any;

const DominionApp: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [integrity, setIntegrity] = useState(100);
    const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
    const [activeModules, setActiveModules] = useState(['Firewall', 'Satellite', 'Neural Gate']);

    const runDiagnostic = async () => {
        setIsDiagnosticRunning(true);
        const report = await GeminiService.generateText("Provide a cryptic 1-sentence system status for a high-fidelity OS kernel.");
        onNotify("Handshake Complete", report, app.icon);
        setTimeout(() => setIsDiagnosticRunning(false), 3000);
    };

    return (
        <AppLayout brandColor="#ff003c" onClose={onClose} title="DOMINION :: COMMAND">
            <div className="flex flex-col h-full bg-[#050505] text-indigo-400 font-mono overflow-hidden">
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10">
                    
                    {/* Neural Integrity Hub */}
                    <div className="relative flex flex-col items-center justify-center py-10">
                        <div className="w-60 h-60 rounded-full border-4 border-indigo-500/10 flex items-center justify-center relative">
                            <MotionDiv 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-indigo-500/40 border-t-transparent rounded-full"
                            />
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase text-indigo-500/40 mb-1 tracking-[0.4em]">Core Integrity</p>
                                <h1 className="text-6xl font-black text-white">{integrity}%</h1>
                                <p className="text-[9px] text-emerald-500 font-bold mt-2 uppercase animate-pulse">Nominal_Link</p>
                            </div>
                        </div>
                    </div>

                    {/* Tactile Control Matrix */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: 'Grid Pulse', icon: Network, color: 'text-indigo-400' },
                            { name: 'Sat Sync', icon: Globe, color: 'text-sky-400' },
                            { name: 'Neural Lock', icon: Lock, color: 'text-rose-400' },
                            { name: 'Matrix Scan', icon: Activity, color: 'text-emerald-400' }
                        ].map((m, i) => (
                            <button key={i} className="bg-zinc-900 border border-white/5 p-6 rounded-[32px] flex flex-col items-center gap-4 active:scale-95 active:bg-zinc-800 transition-all shadow-xl">
                                <m.icon size={28} className={m.color} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{m.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Diagnostic Engine */}
                    <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[40px] flex flex-col gap-6 shadow-2xl">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1 uppercase tracking-tighter">Diagnostic Handshake</h3>
                            <p className="text-indigo-400/60 text-xs font-medium">Verify matrix alignment and node stability.</p>
                        </div>
                        <button 
                            onClick={runDiagnostic}
                            disabled={isDiagnosticRunning}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isDiagnosticRunning ? <RefreshCw size={14} className="animate-spin" /> : <Shield size={14} />}
                            {isDiagnosticRunning ? 'PROBING MODULES...' : 'IGNITE_DIAGNOSTIC'}
                        </button>
                    </div>

                    {/* Active Registry */}
                    <div className="space-y-4 pb-20">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2">Synchronized Nodes</h3>
                         <div className="bg-black/40 border border-white/5 rounded-[32px] overflow-hidden divide-y divide-white/5 shadow-inner">
                             {activeModules.map(m => (
                                 <div key={m} className="p-5 flex justify-between items-center">
                                     <div className="flex items-center gap-3">
                                         <Cpu size={16} className="text-indigo-500/40" />
                                         <span className="text-sm font-bold text-white/80">{m} Node</span>
                                     </div>
                                     <div className="flex items-center gap-2">
                                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
                                         <span className="text-[10px] font-black text-emerald-500 uppercase">Active</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>

                {/* Footer Telemetry */}
                <div className="h-12 bg-indigo-600/5 border-t border-white/5 flex items-center px-6 justify-between shrink-0">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30">Uplink: Project_Sarah</span>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30">V27.Ω</span>
                </div>
            </div>
        </AppLayout>
    );
};

export default DominionApp;
