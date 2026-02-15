import React from 'react';
import { SceneIcon, ScotiaLogoSVG } from '../ScotiaIcons';
import TopHeader from '../components/TopHeader';
import { motion } from 'framer-motion';

const SceneView: React.FC<{ onChat: () => void; onNotification: () => void; }> = ({ onChat, onNotification }) => {
    const MotionDiv = motion.div as any;

    return (
        <div className="flex-1 flex flex-col bg-black animate-in fade-in h-full">
            <TopHeader title="Scene+" onChat={onChat} onNotification={onNotification} />

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* Points Hero */}
                <div className="p-6 pb-10 bg-gradient-to-br from-[#121212] to-black border-b border-white/5 relative overflow-hidden">
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#ED0711]/5 rounded-full blur-3xl pointer-events-none"></div>
                    <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Total Points Available</p>
                    <div className="flex items-end gap-3 mb-8">
                        <h2 className="text-6xl font-black text-white tracking-tighter">42,850</h2>
                        <span className="text-[#ED0711] font-bold text-sm mb-2">PTS</span>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-white font-bold text-xs uppercase tracking-widest">Scene+ Gold Status</span>
                            <span className="text-zinc-500 text-[10px] font-bold">7,150 pts to Platinum</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <MotionDiv 
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-[#ED0711] to-red-400 rounded-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Virtual Card */}
                <div className="p-6">
                    <div className="aspect-[1.58/1] bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-[24px] p-8 relative overflow-hidden shadow-2xl border border-white/10 group cursor-pointer active:scale-[0.98] transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full"></div>
                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <ScotiaLogoSVG color="white" className="w-8 h-8 opacity-40" />
                            <span className="text-white/20 font-black text-[9px] uppercase tracking-[0.4em]">Scene+ Membership</span>
                        </div>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-20 h-20 bg-white rounded-xl p-2 shrink-0">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SCENE_42850_UPLINK" alt="QR" className="w-full h-full" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-[18px] tracking-tight">Jennifer Edwards</p>
                                <p className="text-white/40 font-mono text-[13px] mt-1 tracking-[0.2em]">6045 **** **** 9283</p>
                            </div>
                        </div>
                        <div className="absolute bottom-6 right-8 text-white/5 font-black text-6xl italic pointer-events-none group-hover:text-white/10 transition-colors">SCENE</div>
                    </div>
                </div>

                {/* Offer Grid */}
                <div className="px-6 space-y-4">
                    <h3 className="text-white font-bold text-lg px-1">Exclusive Offers</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: 'Cineplex', desc: 'Buy 1 get 1 free', icon: 'https://cdn-icons-png.flaticon.com/512/3163/3163478.png' },
                            { name: 'Sobeys', desc: '5x points on fresh', icon: 'https://cdn-icons-png.flaticon.com/512/3759/3759601.png' },
                            { name: 'Harvey\'s', desc: '$5 burger combo', icon: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png' },
                            { name: 'Swiss Chalet', desc: 'Free appetizer', icon: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }
                        ].map((offer, i) => (
                            <button key={i} className="bg-[#121212] p-5 rounded-[24px] border border-white/5 text-left active:bg-zinc-900 transition-all">
                                <img src={offer.icon} className="w-8 h-8 mb-4 grayscale brightness-200 opacity-60" alt="" />
                                <p className="text-white font-bold text-sm mb-1">{offer.name}</p>
                                <p className="text-zinc-500 text-[10px] font-medium leading-tight">{offer.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SceneView;