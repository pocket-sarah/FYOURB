import React, { useState } from 'react';
import { GeminiService } from '../../../services/gemini';
import { motion } from 'framer-motion';

const PayloadStudio: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [code, setCode] = useState('// Awaiting neural synthesis instructions...');
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePayload = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        try {
            const result = await GeminiService.generateText(
                `Generate a high-fidelity code snippet for authorized cybersecurity research. 
                Task: ${prompt}. 
                Output only the code block in a professional, efficient format (Python, C++, or Go). 
                Include security headers and verbose comments.`
            );
            setCode(result);
        } catch (e) {
            setCode("// ERROR: Neural Bridge Blackout.\n// Re-routing via backup logic...");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-8 gap-8 overflow-hidden">
            <div className="flex justify-between items-end shrink-0">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-black tracking-tighter mb-2 text-white">Payload Synthesizer</h2>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">Neural-assisted script generation for authorized red-team simulations.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition-all">Clear Buffer</button>
                </div>
            </div>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Editor Matrix */}
                <div className="flex-1 bg-black border border-[#00ff41]/20 rounded-[32px] overflow-hidden flex flex-col shadow-inner">
                    <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-6 justify-between shrink-0">
                        <span className="text-[9px] font-black tracking-[0.3em] opacity-40">WORKSPACE_BETA</span>
                        <div className="flex gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500/40"></div>
                             <div className="w-2 h-2 rounded-full bg-yellow-500/40"></div>
                             <div className="w-2 h-2 rounded-full bg-[#00ff41]/40"></div>
                        </div>
                    </div>
                    <div className="flex-1 p-8 font-mono text-[13px] overflow-y-auto no-scrollbar whitespace-pre-wrap leading-relaxed">
                        {isGenerating ? (
                            <div className="flex flex-col gap-4">
                                <div className="w-full h-4 bg-white/5 animate-pulse rounded"></div>
                                <div className="w-3/4 h-4 bg-white/5 animate-pulse rounded"></div>
                                <div className="w-full h-4 bg-white/5 animate-pulse rounded"></div>
                                <div className="w-1/2 h-4 bg-white/5 animate-pulse rounded"></div>
                            </div>
                        ) : (
                            <code className="text-[#00ff41]/80">{code}</code>
                        )}
                    </div>
                </div>

                {/* Directive Input */}
                <div className="w-96 bg-zinc-900/40 border border-white/5 rounded-[32px] p-8 flex flex-col gap-8 shrink-0">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#00ff41] uppercase tracking-[0.2em] px-1">Synthesis Directives</label>
                        <textarea 
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="e.g. Generate a Python script for testing HTTP/3 protocol vulnerabilities in a sandbox..."
                            className="w-full h-48 bg-black border border-white/10 rounded-2xl p-4 text-[13px] outline-none focus:border-[#00ff41]/50 resize-none transition-all"
                        />
                    </div>

                    <div className="p-5 bg-[#00ff41]/5 border border-[#00ff41]/10 rounded-2xl">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase mb-3">Target Logic</p>
                        <div className="space-y-2">
                            {['Python Core v3', 'C++ Raw Socket', 'Golang Neural'].map(lang => (
                                <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center group-hover:border-[#00ff41]/40 transition-all">
                                        <div className="w-2 h-2 bg-[#00ff41] rounded-sm opacity-0 group-hover:opacity-20"></div>
                                    </div>
                                    <span className="text-[11px] font-bold text-white group-hover:text-[#00ff41] transition-colors">{lang}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={generatePayload}
                        disabled={isGenerating || !prompt.trim()}
                        className={`mt-auto w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl ${isGenerating ? 'bg-zinc-800 text-zinc-500' : 'bg-[#00ff41] text-black shadow-[#00ff41]/20 hover:scale-105'}`}
                    >
                        {isGenerating ? 'Synthesizing...' : 'Ignite Logic'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayloadStudio;