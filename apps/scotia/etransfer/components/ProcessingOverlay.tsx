
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScotiaLogoSVG, AlertIcon } from '../../ScotiaIcons';
import { TransferStage } from '../types';

interface ProcessingOverlayProps {
    stage: TransferStage;
    error?: string;
    onRetry: () => void;
    onAbort: () => void;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ stage, error, onRetry, onAbort }) => {
    const MotionDiv = motion.div as any;

    return (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm z-[1000] flex flex-col items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                {stage === 'sending' && (
                    <MotionDiv 
                        key="sending" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="relative flex items-center justify-center w-full h-full"
                    >
                        <div className="relative flex items-center justify-center">
                            {/* Spinning Ring */}
                            <MotionDiv 
                                className="absolute w-20 h-20 border-[3px] border-white/10 border-t-[#ED0711] rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            />
                            {/* Center Logo - Static */}
                            <div className="relative z-10 p-2 bg-black rounded-full">
                                <ScotiaLogoSVG className="w-8 h-8" color="#ED0711" />
                            </div>
                        </div>
                    </MotionDiv>
                )}
                
                {stage === 'completed' && (
                    <MotionDiv 
                        key="success" 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="w-16 h-16 bg-[#008751] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,135,81,0.4)]">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </MotionDiv>
                )}

                {stage === 'error' && (
                    <MotionDiv 
                        key="error" 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="flex flex-col items-center text-center max-w-xs relative z-10 p-6"
                    >
                        <div className="w-16 h-16 bg-[#ED0711]/10 border border-[#ED0711]/20 rounded-full flex items-center justify-center mb-6 text-[#ED0711] shadow-2xl">
                            <AlertIcon size={32} color="#ED0711" />
                        </div>
                        <h2 className="text-white font-bold text-lg mb-2">Connection Error</h2>
                        <div className="w-full space-y-3 mt-6">
                            <button 
                                onClick={onRetry} 
                                className="w-full py-3.5 bg-[#ED0711] text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/20 text-sm"
                            >
                                Try Again
                            </button>
                            <button 
                                onClick={onAbort} 
                                className="w-full py-3.5 bg-transparent text-zinc-400 font-bold rounded-xl transition-all border border-zinc-800 hover:text-white active:bg-white/5 text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProcessingOverlay;
