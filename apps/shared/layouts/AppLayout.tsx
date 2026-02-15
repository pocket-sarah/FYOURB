
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralAidOverlay from '../../../components/NeuralAidOverlay';

interface AppLayoutProps {
    children: React.ReactNode;
    brandColor?: string;
    onClose: () => void;
    title?: string;
}

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const AppLayout: React.FC<AppLayoutProps> = ({ children, brandColor = '#1c1c1e', onClose, title }) => {
    const [isAidOpen, setIsAidOpen] = useState(false);

    return (
        /* Fix: Use MotionDiv */
        <MotionDiv 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-0 z-[100] flex flex-col overflow-hidden bg-black shadow-2xl"
            style={{ borderTop: `4px solid ${brandColor}` }}
        >
            <div className="h-14 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md border-b border-white/5 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 -ml-2 text-white/40 hover:text-white active:scale-90 transition-all">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    {title && <h2 className="text-white font-black text-sm uppercase tracking-widest opacity-80">{title}</h2>}
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsAidOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/20 px-3 py-1.5 rounded-full hover:bg-indigo-600/20 transition-all group"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest group-hover:text-indigo-300 transition-colors">Neural Aid</span>
                    </button>
                    
                    <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-green-500/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                        </div>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Uplink: Boosted</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                {children}
            </div>

            <NeuralAidOverlay 
                componentId={title || "Module"} 
                isOpen={isAidOpen} 
                onClose={() => setIsAidOpen(false)} 
            />
        </MotionDiv>
    );
};

export default AppLayout;
