import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TDLogoSVG } from '../../TDIcons';
import { TransferStage } from '../types';
import { Check, AlertCircle } from 'lucide-react';

interface ProcessingOverlayProps {
    stage: TransferStage;
    error?: string;
    onRetry: () => void;
    onAbort: () => void;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ stage, error, onRetry, onAbort }) => {
    const MotionDiv = motion.div as any;
    const MotionSvg = motion.svg as any;

    return (
        <div className="absolute inset-0 bg-white z-[1000] flex flex-col items-center justify-center overflow-hidden p-8 font-sans">
            <AnimatePresence mode="wait">
                {stage === 'sending' && (
                    <MotionDiv 
                        key="sending" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="flex flex-col items-center gap-10 relative z-10"
                    >
                        <div className="relative flex items-center justify-center">
                            {/* Spinner Animation around Logo */}
                            <div className="w-24 h-24 border-4 border-gray-50 rounded-full"></div>
                            <MotionDiv 
                                className="absolute w-24 h-24 border-4 border-[#008A00] border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <TDLogoSVG size={32} className="rounded-md" />
                            </div>
                        </div>
                        
                        <div className="text-center space-y-2">
                            <h2 className="text-gray-900 font-black text-lg uppercase tracking-widest">Processing</h2>
                        </div>
                    </MotionDiv>
                )}
                
                {stage === 'completed' && (
                    <MotionDiv 
                        key="success" 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="flex flex-col items-center gap-8 relative z-10"
                    >
                        <div className="w-24 h-24 bg-[#008A00] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,138,0,0.3)]">
                            <MotionSvg 
                                width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <path d="M20 6L9 17l-5-5"/>
                            </MotionSvg>
                        </div>
                    </MotionDiv>
                )}

                {stage === 'error' && (
                    <MotionDiv 
                        key="error" 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="flex flex-col items-center text-center max-w-xs relative z-10"
                    >
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 text-red-500 border border-red-500/20">
                            <AlertCircle size={40} />
                        </div>
                        <h2 className="text-gray-800 font-black text-2xl mb-3 tracking-tighter uppercase">UPLINK SEVERED</h2>
                        <p className="text-gray-500 text-sm mb-12 leading-relaxed font-medium">{error || "Connection error during secure handshake."}</p>
                        <div className="w-full space-y-4">
                            <button 
                                onClick={onRetry} 
                                className="w-full py-4 bg-[#008A00] text-white font-black rounded-xl transition-all uppercase tracking-widest text-[12px] active:scale-95 shadow-lg shadow-green-500/20"
                            >
                                Re-Initialize
                            </button>
                            <button 
                                onClick={onAbort} 
                                className="w-full py-4 bg-transparent text-gray-400 font-black rounded-xl transition-all uppercase tracking-widest text-[11px] border border-gray-200 active:bg-gray-50"
                            >
                                Abort Protocol
                            </button>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProcessingOverlay;