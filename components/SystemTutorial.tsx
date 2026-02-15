
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SystemTutorial: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const MotionDiv = motion.div as any;

    const steps = [
        {
            title: "System Initialization",
            body: "Welcome to RBOS (Robyn Banks OS). This environment simulates a high-fidelity mobile banking ecosystem for research purposes.",
            icon: (
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center animate-pulse">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
            )
        },
        {
            title: "Identity Configuration",
            body: "Before engaging with banking modules, you must configure your Sender Identity. This ensures all generated receipts and notifications match your persona.",
            icon: (
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
            )
        },
        {
            title: "Asset Management",
            body: "Access the 'Settings' app to modify bank balances, account names, and credentials for both Scotiabank and TD. Customize the environment to fit your scenario.",
            icon: (
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <MotionDiv 
                key={step}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
                
                <div className="flex flex-col items-center text-center space-y-6">
                    {steps[step].icon}
                    
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-white tracking-tight">{steps[step].title}</h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">{steps[step].body}</p>
                    </div>

                    <div className="flex gap-2 pt-4">
                        {steps.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-indigo-500 w-6' : 'bg-zinc-700'}`} />
                        ))}
                    </div>

                    <button 
                        onClick={handleNext}
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-zinc-200 transition-colors shadow-lg active:scale-95"
                    >
                        {step === steps.length - 1 ? 'Initialize System' : 'Next'}
                    </button>
                </div>
            </MotionDiv>
        </div>
    );
};

export default SystemTutorial;
