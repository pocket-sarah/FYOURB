
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankApp } from '../types';

interface GlobalNavigationProps {
    isOpen: boolean;
    apps: BankApp[];
    onOpenApp: (id: string) => void;
    onClose: () => void;
    onTriggerSwitcher: () => void;
    onHome: () => void;
    activeAppId: string | null;
}

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const GlobalNavigation: React.FC<GlobalNavigationProps> = ({ 
    isOpen, apps, onOpenApp, onClose, onTriggerSwitcher, onHome, activeAppId 
}) => {
    
    // One UI 6 Nav Bar at bottom
    const handleGlobalBack = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeAppId) {
            onTriggerSwitcher();
        }
    };

    return (
        <>
            {/* Samsung Navigation Bar (Gesture Hint) */}
            <div className="fixed bottom-0 left-0 right-0 h-8 z-[3000] flex justify-center items-end pb-3 pointer-events-none">
                <div className="w-32 h-1 bg-white/40 rounded-full backdrop-blur-md shadow-sm"></div>
            </div>

            {/* Invisible Hit Zones */}
            <div className="fixed bottom-0 left-0 right-0 h-10 z-[2999] flex">
                <div onClick={onTriggerSwitcher} className="flex-1 cursor-pointer pointer-events-auto"></div>
                <div onClick={onHome} className="flex-1 cursor-pointer pointer-events-auto"></div>
                <div onClick={handleGlobalBack} className="flex-1 cursor-pointer pointer-events-auto"></div>
            </div>

            {/* App Switcher */}
            <AnimatePresence>
                {isOpen && (
                    /* Fix: Use MotionDiv */
                    <MotionDiv 
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        className="fixed inset-0 z-[2500] bg-black/40 flex flex-col justify-center pb-20"
                        onClick={onClose}
                    >
                        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar px-10 py-10 w-full snap-x snap-mandatory">
                            {apps.filter(a => a.isInstalled).map((app) => (
                                /* Fix: Use MotionDiv */
                                <MotionDiv
                                    key={app.id}
                                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        onOpenApp(app.id);
                                    }}
                                    className="snap-center shrink-0 w-[260px] aspect-[9/18] bg-zinc-900 rounded-[28px] overflow-hidden shadow-2xl relative border border-white/10 flex flex-col"
                                >
                                    {/* App Header */}
                                    <div className="p-4 flex items-center gap-3 bg-zinc-800/50">
                                        <img src={app.icon} className="w-8 h-8 rounded-lg" alt="" />
                                        <span className="text-white font-bold text-sm">{app.name}</span>
                                    </div>
                                    
                                    {/* Preview Body (Simulated) */}
                                    <div className="flex-1 bg-zinc-900 flex items-center justify-center relative">
                                        {activeAppId === app.id ? (
                                            <div className="text-center opacity-50">
                                                <p className="text-xs text-white uppercase tracking-widest font-bold">Active State</p>
                                            </div>
                                        ) : (
                                            <img src={app.icon} className="w-16 h-16 rounded-[20px] opacity-20 grayscale" alt="" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                                    </div>
                                </MotionDiv>
                            ))}
                        </div>

                        <div className="text-center mt-4">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onHome(); }}
                                className="px-6 py-2 bg-white/10 rounded-full text-white font-medium text-sm backdrop-blur-md"
                            >
                                Close All
                            </button>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalNavigation;
