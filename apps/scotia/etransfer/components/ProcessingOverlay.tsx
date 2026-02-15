
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

// Fix: Use casted any for motion components to bypass intrinsic property errors
const MotionDiv = motion.div as any;
const MotionSvg = motion.svg as any;

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ stage, error, onRetry, onAbort }) => (
    <div className="absolute inset-0 bg-black z-[1000] flex flex-col items-center justify-center overflow-hidden p-8">
        {/* Matrix background effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 animate-[pulse_4s_infinite] bg-[radial-gradient(circle_at_center,_#ED0711_0%,_transparent_70%)] blur-3xl"></div>
        </div>

        <AnimatePresence mode="wait">
            {stage === 'sending' && (
                /* Fix: Use MotionDiv */
                <MotionDiv 
                    key="sending" 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }} 
                    className="flex flex-col items-center gap-12 relative z-10"
                >
                    <div className="relative flex items-center justify-center">
                        {/* Fix: Use MotionDiv */}
                        <MotionDiv 
                            className="absolute w-32 h-32 bg-[#ED0711]/5 rounded-full border border-[#ED0711]/20 shadow-[0_0_50px_rgba(237,7,17,0.1)]" 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} 
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
                        />
                        {/* Fix: Use MotionDiv */}
                        <MotionDiv 
                            className="absolute w-24 h-24 border-2 border-dashed border-[#ED0711]/30 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Fix: Use MotionDiv */}
                        <MotionDiv 
                            animate={{ scale: [1, 1.05, 1], filter: ['drop-shadow(0 0 0px #ED0711)', 'drop-shadow(0 0 15px #ED0711)', 'drop-shadow(0 0 0px #ED0711)'] }} 
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                            className="relative z-20 bg-black p-4 rounded-full border border-white/5"
                        >
                            <ScotiaLogoSVG className="w-10 h-10" color="#ED0711" />
                        </MotionDiv>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <h2 className="text-white font-black text-[12px] uppercase tracking-[0.4em] animate-pulse">Establishing Neural Link</h2>
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map(i => (
                                /* Fix: Use MotionDiv */
                                <MotionDiv key={i} className="w-1.5 h-1.5 bg-[#ED0711] rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                            ))}
                        </div>
                    </div>
                </MotionDiv>
            )}
            
            {stage === 'completed' && (
                /* Fix: Use MotionDiv */
                <MotionDiv 
                    key="success" 
                    initial={{ opacity: 0, scale: 0.5, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    className="flex flex-col items-center gap-8 relative z-10"
                >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        {/* Fix: Use MotionSvg */}
                        <MotionSvg 
                            width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <path d="M20 6L9 17l-5-5"/>
                        </MotionSvg>
                    </div>
                    <div className="text-center">
                        <h2 className="text-green-500 font-black text-lg uppercase tracking-widest mb-1">Handshake Secure</h2>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Transaction Locked to Grid</p>
                    </div>
                </MotionDiv>
            )}

            {stage === 'error' && (
                /* Fix: Use MotionDiv */
                <MotionDiv 
                    key="error" 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="flex flex-col items-center text-center max-w-xs relative z-10"
                >
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 text-red-500 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <AlertIcon size={40} />
                    </div>
                    <h2 className="text-white font-black text-2xl mb-3 tracking-tighter">UPLINK SEVERED</h2>
                    <p className="text-zinc-500 text-sm mb-12 leading-relaxed font-medium">{error || "Neural matrix destabilized during handshake protocol."}</p>
                    <div className="w-full space-y-4">
                        <button 
                            onClick={onRetry} 
                            className="w-full py-5 bg-white text-black font-black rounded-2xl transition-all uppercase tracking-widest text-[12px] active:scale-95"
                        >
                            Reconnect Relay
                        </button>
                        <button 
                            onClick={onAbort} 
                            className="w-full py-4 bg-transparent text-zinc-600 font-black rounded-2xl transition-all uppercase tracking-widest text-[11px] border border-white/5 active:bg-white/5"
                        >
                            Abort Protocol
                        </button>
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
);

export default ProcessingOverlay;
