
import React, { useState } from 'react';
import { TDLogoSVG } from '../TDIcons';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginViewProps {
  onSignIn: () => void;
  // Added optional initialUsername property to resolve TDApp usage error
  initialUsername?: string;
}

const LoginView: React.FC<LoginViewProps> = ({ onSignIn, initialUsername }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  // Initializing state with initialUsername if available
  const [username, setUsername] = useState(initialUsername || 'albe****rms');
  const MotionDiv = motion.div as any;

  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center animate-in fade-in overflow-hidden font-sans">
      <div className="h-10 w-full shrink-0"></div>

      <div className="flex-1 w-full flex flex-col items-center pt-12 px-10">
        <div className="mb-14 rounded-lg overflow-hidden shadow-sm">
            <TDLogoSVG size={52} />
        </div>

        <p className="text-gray-900 font-bold text-[16px] mb-12">Good morning</p>

        <div className="flex flex-col items-center gap-1.5 mb-16">
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                data-lpignore="true"
                spellCheck="false"
                className="text-gray-900 font-black text-[22px] tracking-tight text-center bg-transparent border-none outline-none w-full"
            />
            <button 
                onClick={() => setShowQuickView(true)}
                className="text-[#008A00] font-bold text-[13px] hover:opacity-70 transition-opacity"
            >
                Quick View
            </button>
        </div>

        <div className="w-full max-w-sm space-y-6 mt-12">
            <button 
                onClick={onSignIn}
                className="w-full py-4 bg-[#4A8F29] text-white font-black rounded-md text-[17px] shadow-md active:scale-[0.98] transition-all"
            >
                Log in
            </button>

            <button className="w-full text-[#008A00] font-bold text-[13px] hover:underline py-2">
                Switch Username or Access Card
            </button>
        </div>
      </div>

      <AnimatePresence>
        {showQuickView && (
            <>
                <MotionDiv 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowQuickView(false)}
                    className="absolute inset-0 bg-black/40 z-[1000] backdrop-blur-[2px]"
                />
                <MotionDiv 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-[1001] pb-12 shadow-2xl overflow-hidden"
                >
                    <div className="h-1.5 w-12 bg-gray-200 rounded-full mx-auto mt-3 mb-6"></div>
                    <div className="px-6 flex justify-between items-center mb-6">
                        <h3 className="font-black text-gray-800 text-lg">My Accounts</h3>
                        <button onClick={() => setShowQuickView(false)} className="text-[#008A00] font-bold text-sm">Close</button>
                    </div>

                    <div className="divide-y divide-gray-100">
                        <div className="px-6 py-5 flex justify-between items-center bg-white">
                            <span className="text-gray-700 font-bold text-[15px]">TD EveryDay Chequing</span>
                            <span className="text-gray-900 font-black text-[17px] tracking-tight">$****.**</span>
                        </div>
                        <div className="px-6 py-5 flex justify-between items-center bg-white">
                            <span className="text-gray-700 font-bold text-[15px]">TD EveryDay Savings</span>
                            <span className="text-gray-900 font-black text-[17px] tracking-tight">$****.**</span>
                        </div>
                    </div>

                    <div className="px-6 pt-8">
                        <button 
                            onClick={onSignIn}
                            className="w-full py-4 bg-[#4A8F29] text-white font-black rounded-md text-lg active:scale-[0.98] transition-all shadow-md"
                        >
                            Log in to view more
                        </button>
                    </div>
                </MotionDiv>
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginView;
