import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeminiService } from '../../../services/gemini';
import { Terminal, ShieldAlert, Zap, Cpu, Activity, Info } from 'lucide-react';

const MotionDiv = motion.div as any;

const NeuralDebugger: React.FC<{ onNotify: any }> = ({ onNotify }) => {
    const [issue, setIssue] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [diagnosis, setDiagnosis] = useState<string | null>(null);
    const [entropyLevel, setEntropyLevel] = useState(14);
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchEvidence = async () => {
            try {
                const res = await fetch('/api/evidence/stream');
                const data = await res.json();
                setLogs(data.records || []);
            } catch (e) {
                setLogs([{ node: 'LOCAL_GATEWAY', event: 'STANDALONE_PROTOCOL', timestamp: Date.now() }]);
            }
        };
        fetchEvidence();
    }, []);

    const startDeepAnalysis = async () => {
        if (isAnalyzing) return;
        setIsAnalyzing(true);
        setDiagnosis(null);
        setEntropyLevel(85);

        const context = `
            SYSTEM CONTEXT: RBOS-CORE Research Grid v25
            LAST LOGS: ${JSON.stringify(logs.slice(-5))}
            USER REPORTED ISSUE: ${issue || "Requesting general diagnostic optimization scan."}
        `;

        try {
            const result = await GeminiService.generateText(
                `You are the Aegis Neural Debugger for RBOS OS. 
                Analyze the following system context and logs: ${context}.
                Provide a technical diagnosis, identify potential security bottlenecks or protocol failures, and suggest 3 concrete technical fixes. 
                Use professional, cold, technical language. NO conversational filler.`
            );
            setDiagnosis(result);
            setEntropyLevel(5);
            onNotify("Diagnostic Complete", "Neural Matrix Stabilized.", "https://cdn-icons-png.flaticon.com/512/3953/3953226.png");
        } catch (e) {
            setDiagnosis("CRITICAL: Neural hand-off failed. Matrix entropy exceeds 95%. Re-initialize core credentials.");
            setEntropyLevel(99);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="h-full flex gap-4 p-4 overflow-hidden bg-black text-[#ff003c] font-mono">
            {/* Control Panel */}
            <div className="w-80 flex flex-col gap-4 shrink-0">
                <div className="bg-zinc-900/60 border border-[#ff003c]/20 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-black tracking-tighter flex items-center gap-3">
                        <Terminal size={18} /> AEGIS_DEB v6.1
                    </h2>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#ff003c]/40 tracking-widest">Target Directive</label>
                        <textarea 
                            value={issue}
                            onChange={e => setIssue(e.target.value)}
                            placeholder="Enter system directive..."
                            className="w-full h-32 bg-black border border-[#ff003c]/20 rounded-xl p-3 text-xs outline-none focus:border-[#ff003c]/50 resize-none transition-all text-[#ff003c]"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase text-[#ff003c]/40">Node_Entropy</span>
                        <span className={`text-[10px] font-black ${entropyLevel > 50 ? 'text-red-500 animate-pulse' : 'text-[#ff003c]'}`}>{entropyLevel}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <MotionDiv 
                            animate={{ width: `${entropyLevel}%` }}
                            className={`h-full ${entropyLevel > 50 ? 'bg-red-500' : 'bg-[#ff003c]'}`}
                        />
                    </div>
                    <button 
                        onClick={startDeepAnalysis}
                        disabled={isAnalyzing}
                        className="w-full py-4 bg-[#ff003c] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                    >
                        {isAnalyzing ? <Activity size={14} className="animate-spin" /> : <Cpu size={14} />}
                        {isAnalyzing ? 'PROBING...' : 'RUN_DIAGNOSTIC'}
                    </button>
                </div>

                <div className="flex-1 bg-zinc-900/40 border border-[#ff003c]/10 rounded-2xl p-4 overflow-hidden flex flex-col">
                    <h3 className="text-[8px] font-black uppercase text-zinc-500 mb-2 flex items-center gap-2">
                        <Activity size={10} /> Live_Feed
                    </h3>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 font-mono text-[9px]">
                        {logs.slice(-8).map((log, i) => (
                            <div key={i} className="opacity-40 hover:opacity-100 transition-opacity truncate">
                                <span className="text-[#ff003c]/60">[{new Date(log.timestamp).toLocaleTimeString([], {hour12:false})}]</span> {log.event}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Matrix Analysis Output */}
            <div className="flex-1 flex flex-col min-w-0 bg-black border border-[#ff003c]/20 rounded-2xl overflow-hidden relative shadow-2xl">
                <div className="h-10 border-b border-[#ff003c]/10 flex items-center px-6 bg-white/5 relative z-10">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Analysis_Matrix_Output</span>
                </div>

                <div className="flex-1 overflow-y-auto p-8 no-scrollbar relative z-10">
                    <AnimatePresence mode="wait">
                        {isAnalyzing ? (
                            <MotionDiv 
                                key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center gap-6"
                            >
                                <div className="w-16 h-16 relative">
                                    <div className="absolute inset-0 border-4 border-[#ff003c]/10 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-[#ff003c] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] font-black animate-pulse tracking-[0.4em]">RECONSTRUCTING_NEURAL_LOGIC</p>
                                    <p className="text-[9px] opacity-40 mt-2">Bypassing encrypted headers...</p>
                                </div>
                            </MotionDiv>
                        ) : diagnosis ? (
                            <MotionDiv 
                                key="diagnosis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="text-[13px] leading-relaxed text-[#ff003c]/90 whitespace-pre-wrap"
                            >
                                <div className="p-4 bg-[#ff003c]/5 border border-[#ff003c]/20 rounded-lg mb-8">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <ShieldAlert size={14} /> Neural Resolution
                                    </h4>
                                    {diagnosis}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-[#ff003c]/10">
                                    <button className="px-6 py-3 bg-[#ff003c] text-black border border-[#ff003c] rounded-lg text-[10px] font-black hover:bg-white transition-all uppercase tracking-widest">Inject_Fix_V4</button>
                                    <button className="px-6 py-3 bg-transparent border border-[#ff003c]/30 rounded-lg text-[10px] font-black text-[#ff003c] hover:bg-[#ff003c]/10 transition-all uppercase tracking-widest">Re-Index_Ledger</button>
                                </div>
                            </MotionDiv>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6">
                                <Zap size={80} strokeWidth={1} />
                                <p className="text-[10px] font-black uppercase tracking-[0.6em]">System Idle :: Awaiting Probe</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default NeuralDebugger;