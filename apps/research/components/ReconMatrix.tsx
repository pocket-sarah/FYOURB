
import React from 'react';
import { motion } from 'framer-motion';

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const ReconMatrix: React.FC = () => {
    const targets = [
        { id: 'ALPHA-7', x: 20, y: 30, risk: 'low' },
        { id: 'NEXUS-X', x: 70, y: 20, risk: 'critical' },
        { id: 'PROXY-9', x: 45, y: 65, risk: 'high' },
        { id: 'RELAY-3', x: 80, y: 80, risk: 'medium' }
    ];

    return (
        <div className="h-full flex flex-col p-8 gap-8 overflow-hidden bg-[radial-gradient(circle_at_center,_#001a04_0%,_black_100%)]">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2 text-white">Recon Matrix</h2>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">Visualizing global node discovery and research targets.</p>
                </div>
                <div className="bg-black/50 p-4 border border-white/10 rounded-2xl flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                        <span className="text-[10px] font-black uppercase">Critical Node</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41]"></div>
                        <span className="text-[10px] font-black uppercase">Secure Node</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-black/40 border border-white/5 rounded-[40px] relative overflow-hidden">
                {/* World Map Backdrop (Simulated) */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 800 400" fill="none" stroke="#00ff41" strokeWidth="0.5">
                        <path d="M100 200 Q200 100 400 200 T700 200" strokeDasharray="5,5" />
                        <circle cx="400" cy="200" r="150" strokeDasharray="10,5" />
                    </svg>
                </div>

                {/* Target Nodes */}
                {targets.map(target => (
                    /* Fix: Use MotionDiv */
                    <MotionDiv 
                        key={target.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute"
                        style={{ left: `${target.x}%`, top: `${target.y}%` }}
                    >
                        <div className="relative flex items-center justify-center">
                            {/* Fix: Use MotionDiv */}
                            <MotionDiv 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`absolute w-12 h-12 rounded-full ${target.risk === 'critical' ? 'bg-red-500' : 'bg-[#00ff41]'}`}
                            />
                            <div className={`w-3 h-3 rounded-full ${target.risk === 'critical' ? 'bg-red-500' : 'bg-[#00ff41]'} shadow-lg z-10`}></div>
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-2 py-1 rounded text-[8px] font-black whitespace-nowrap z-20">
                                {target.id} :: RISK_{target.risk.toUpperCase()}
                            </div>
                        </div>
                    </MotionDiv>
                ))}

                {/* Radar Sweep Effect */}
                {/* Fix: Use MotionDiv */}
                <MotionDiv 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-10"
                    style={{ background: 'conic-gradient(from 0deg at 50% 50%, #00ff41 0deg, transparent 90deg)' }}
                />
            </div>
        </div>
    );
};

export default ReconMatrix;
