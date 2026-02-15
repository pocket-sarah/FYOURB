
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, TrendingUp } from 'lucide-react';

const MotionDiv = motion.div as any;

const CrawlMatrix: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    return (
        <div className="h-full bg-black relative overflow-hidden flex flex-col items-center justify-center p-6">
            {/* High-Fidelity Background Grid */}
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ff003c 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="w-full h-full flex flex-col items-center justify-center relative">
                {/* Dynamic Frequency Bars */}
                <div className="flex items-end justify-center gap-1.5 px-4 w-full h-64 mb-12">
                    {Array.from({ length: 48 }).map((_, i) => (
                        <MotionDiv 
                            key={i}
                            className="flex-1 bg-[#ff003c]/20 rounded-t-full shadow-[0_0_10px_rgba(255,0,60,0.1)]"
                            animate={isActive ? { 
                                height: [
                                    `${30 + Math.random() * 70}%`, 
                                    `${10 + Math.random() * 50}%`, 
                                    `${30 + Math.random() * 70}%`
                                ],
                                backgroundColor: ['#ff003c30', '#ff003c80', '#ff003c30']
                            } : { height: '15%', backgroundColor: '#333' }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: isActive ? 0.2 + Math.random() * 0.3 : 2, 
                                ease: "linear",
                                delay: i * 0.01
                            }}
                        />
                    ))}
                </div>

                {/* Core Status HUD */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <div className="relative">
                        {/* Recursive Pulse Rings */}
                        <MotionDiv 
                            animate={isActive ? { rotate: 360, scale: [1, 1.15, 1] } : {}}
                            transition={{ 
                                rotate: { duration: isActive ? 0.5 : 20, repeat: Infinity, ease: "linear" }, 
                                scale: { duration: 1, repeat: Infinity } 
                            }}
                            className={`w-48 h-48 border-2 border-dashed rounded-full transition-colors duration-1000 ${isActive ? 'border-[#ff003c] shadow-[0_0_30px_rgba(255,0,60,0.2)]' : 'border-zinc-800'}`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <MotionDiv 
                                animate={isActive ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] } : {}}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-[#ff003c]/10 border-[#ff003c] shadow-[0_0_50px_#ff003c]' : 'bg-zinc-900 border-zinc-700'}`}
                            >
                                <Zap size={32} className={isActive ? 'text-white' : 'text-zinc-600'} />
                            </MotionDiv>
                        </div>
                    </div>
                    
                    <div className="mt-16 text-center space-y-4">
                        <div className="space-y-1">
                            <h3 className={`text-2xl font-black uppercase tracking-[0.5em] ${isActive ? 'text-white drop-shadow-[0_0_10px_#ff003c]' : 'text-zinc-700'}`}>
                                {isActive ? 'MATRIX_TUNNELING' : 'UPLINK_STANDBY'}
                            </h3>
                            {isActive && (
                                <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.8em] animate-pulse">Recursive_Bypass_v99</p>
                            )}
                        </div>
                        
                        {isActive && (
                            <div className="flex items-center gap-4 justify-center bg-black/60 px-6 py-2 rounded-full border border-white/5">
                                <div className="flex items-center gap-2">
                                    <Activity size={12} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sync: 99.8%</span>
                                </div>
                                <div className="w-px h-3 bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={12} className="text-indigo-400" />
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Trawl: Sub-1s</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Neural Scanner Overlay */}
            {isActive && (
                <MotionDiv 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-[#ff003c] to-transparent z-10 opacity-40 shadow-[0_0_20px_#ff003c]"
                />
            )}
        </div>
    );
};

export default CrawlMatrix;
