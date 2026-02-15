
import React from 'react';
import { motion } from 'framer-motion';

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const CrawlMatrix: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    return (
        <div className="flex-1 bg-black border border-[#ff003c]/10 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ff003c 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
            
            {isActive ? (
                <div className="w-full h-full flex items-center justify-center gap-1.5 px-4">
                    {Array.from({ length: 24 }).map((_, i) => (
                        /* Fix: Use MotionDiv */
                        <MotionDiv 
                            key={i}
                            className="flex-1 bg-[#ff003c]/40 rounded-full"
                            animate={{ 
                                height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`]
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 1.5 + Math.random(), 
                                ease: "easeInOut",
                                delay: i * 0.05
                            }}
                        />
                    ))}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
                         <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-1">Signal_Lock</span>
                         <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest animate-pulse">Scanning Gists...</span>
                    </div>
                </div>
            ) : (
                <div className="text-center opacity-20 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border border-[#ff003c]/40 flex items-center justify-center">
                        <div className="w-1 h-1 bg-[#ff003c] rounded-full"></div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em]">Grid_Link_Standby</p>
                </div>
            )}
        </div>
    );
};

export default CrawlMatrix;
