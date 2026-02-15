import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeminiService } from '../services/gemini';

interface NeuralAidOverlayProps {
    componentId: string;
    isOpen: boolean;
    onClose: () => void;
}

const NeuralAidOverlay: React.FC<NeuralAidOverlayProps> = ({ componentId, isOpen, onClose }) => {
    const [advice, setAdvice] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const MotionDiv = motion.div as any;

    const requestAid = async () => {
        setIsLoading(true);
        try {
            const result = await GeminiService.generateText(
                `The user is currently using the ${componentId} module in RR-OS. 
                Provide 3 quick "Neural Tips" for using this specific application efficiently. 
                Keep it high-tech, concise, and helpful.`
            );
            setAdvice(result);
        } catch (e) {
            setAdvice("Neural satellite uplink failed. Please retry.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <MotionDiv 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-md flex items-end justify-center p-6"
                onClick={onClose}
            >
                <MotionDiv 
                    initial={{ y: 100 }} 
                    animate={{ y: 0 }} 
                    exit={{ y: 100 }}
                    className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl p-8"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1 15v-6h2v6zm0-8V7h2v2z"/></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Neural Assistant</h3>
                                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Aiding {componentId} Module</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        </button>
                    </div>

                    <div className="min-h-[120px] mb-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Scanning Context...</span>
                            </div>
                        ) : advice ? (
                            <div className="prose prose-invert prose-sm">
                                <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{advice}</p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <button 
                                    onClick={requestAid}
                                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/5 transition-all text-sm"
                                >
                                    Engage Neural Scan
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-center">
                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">RR-OS Neural Link v22.4</p>
                    </div>
                </MotionDiv>
            </MotionDiv>
        </AnimatePresence>
    );
};

export default NeuralAidOverlay;