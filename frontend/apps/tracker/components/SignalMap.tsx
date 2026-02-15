import React from 'react';
import { motion } from 'framer-motion';
import { TrackingTarget } from '../index';
// Added Globe to the lucide-react imports
import { Target, Map as MapIcon, Crosshair, Globe } from 'lucide-react';

const MotionDiv = motion.div as any;

const SignalMap: React.FC<{ targets: TrackingTarget[]; isTracking: boolean }> = ({ targets, isTracking }) => {
    return (
        <div className="w-full h-full bg-black relative overflow-hidden flex items-center justify-center p-6">
            {/* Grid Backdrop */}
            <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(#ff003c 1px, transparent 1px), linear-gradient(90deg, #ff003c 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]"></div>

            {/* Pulsing Radar Rings */}
            <div className="relative w-[320px] h-[320px] flex items-center justify-center">
                <div className="absolute inset-0 border border-red-500/20 rounded-full scale-[1.2]"></div>
                <div className="absolute inset-0 border border-red-500/10 rounded-full scale-[1.8]"></div>
                <div className="absolute inset-0 border border-red-500/5 rounded-full scale-[2.4]"></div>
                
                {/* Radar Sweep */}
                <MotionDiv 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-100px] border-l-2 border-red-500/40 rounded-full z-10"
                    style={{ background: 'conic-gradient(from 0deg, #ff003c20 0deg, transparent 90deg)' }}
                />

                {/* Targets */}
                {targets.map((t, i) => (
                    <MotionDiv 
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute z-20"
                        style={{ 
                            left: `${50 + (t.coords[1] % 40)}%`, 
                            top: `${50 + (t.coords[0] % 40)}%` 
                        }}
                    >
                        <div className="relative group flex items-center justify-center">
                            <MotionDiv 
                                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute w-12 h-12 bg-red-500/30 rounded-full"
                            />
                            <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-[0_0_15px_#ff003c]"></div>
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/90 border border-red-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black text-white whitespace-nowrap shadow-2xl transition-all">
                                <p className="mb-0.5">{t.number}</p>
                                <p className="text-[7px] text-red-500 uppercase tracking-widest">{t.location}</p>
                            </div>
                        </div>
                    </MotionDiv>
                ))}

                {isTracking && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-[100]">
                         <div className="w-24 h-24 border-2 border-red-500/50 rounded-full animate-ping flex items-center justify-center">
                            <Crosshair size={32} className="text-white animate-spin-slow" />
                         </div>
                         <p className="mt-10 text-[11px] font-black uppercase tracking-[0.6em] text-white animate-pulse">Triangulating...</p>
                    </div>
                )}
            </div>

            {/* Egypt Region Watermark (Top Right) */}
            <div className="absolute top-10 right-10 flex flex-col items-end opacity-20 pointer-events-none">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="text-[12px] font-black uppercase tracking-widest text-white">Region Node: N_AFRICA</span>
                    <Globe size={18} />
                 </div>
                 <div className="w-32 h-1 bg-white rounded-full"></div>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default SignalMap;