
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const GridMonitor: React.FC = () => {
    const [nodes, setNodes] = useState([
        { id: 'UPLINK_01', status: 'ACTIVE', load: 14, ip: '192.168.1.101', type: 'secure' },
        { id: 'TENSOR_07', status: 'ACTIVE', load: 42, ip: '10.0.0.42', type: 'secure' },
        { id: 'RELAY_GATE', status: 'STANDBY', load: 0, ip: '127.0.0.1', type: 'secure' },
        { id: 'NEURAL_SAT', status: 'SYNCING', load: 88, ip: 'satellite.rros', type: 'secure' }
    ]);

    const triggerSimulation = () => {
        setNodes(prev => prev.map(n => ({
            ...n,
            status: Math.random() > 0.5 ? 'COMPROMISED' : 'ACTIVE',
            load: Math.floor(Math.random() * 100),
            type: Math.random() > 0.5 ? 'infected' : 'secure'
        })));
    };

    return (
        <div className="p-4 h-full overflow-y-auto no-scrollbar space-y-4 bg-black/40 font-mono text-[#00ff41]">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold opacity-60 uppercase">Grid Status: ONLINE</span>
                <button 
                    onClick={triggerSimulation}
                    className="px-3 py-1 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded text-[9px] hover:bg-[#00ff41]/20 transition-all uppercase"
                >
                    Simulate Traffic
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {nodes.map(node => (
                    /* Fix: Use MotionDiv and layout property */
                    <MotionDiv 
                        key={node.id}
                        layout
                        className={`bg-zinc-900/60 border rounded-xl p-4 relative overflow-hidden transition-all ${
                            node.type === 'infected' ? 'border-red-500/30' : 'border-[#00ff41]/10'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[8px] font-black opacity-40 tracking-widest">{node.id}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${node.type === 'infected' ? 'bg-red-500 animate-ping' : 'bg-[#00ff41]'} animate-pulse`}></div>
                        </div>
                        <h3 className={`text-sm font-black mb-1 ${node.type === 'infected' ? 'text-red-500' : 'text-[#00ff41]'}`}>{node.status}</h3>
                        <p className="text-[9px] text-zinc-500 mb-3">{node.ip}</p>
                        
                        <div className="space-y-1">
                            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                {/* Fix: Use MotionDiv */}
                                <MotionDiv 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${node.load}%` }}
                                    className={`h-full ${node.load > 80 || node.type === 'infected' ? 'bg-red-500' : 'bg-[#00ff41]'}`}
                                />
                            </div>
                        </div>
                    </MotionDiv>
                ))}
            </div>

            <div className="bg-zinc-900/40 border border-[#00ff41]/10 rounded-xl p-4 relative overflow-hidden h-32">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                <h3 className="text-[8px] font-black uppercase tracking-widest mb-2 opacity-40">Network_Topology</h3>
                
                <div className="flex items-end gap-1 h-12 relative z-10">
                    {Array.from({ length: 40 }).map((_, i) => (
                        /* Fix: Use MotionDiv */
                        <MotionDiv 
                            key={i}
                            className="flex-1 bg-[#00ff41]/40"
                            animate={{ height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] }}
                            transition={{ repeat: Infinity, duration: 2, delay: i * 0.05 }}
                        />
                    ))}
                </div>
                <p className="text-[8px] mt-2 opacity-20">ENCRYPTION_LAYER_4 :: ACTIVE</p>
            </div>
        </div>
    );
};

export default GridMonitor;
