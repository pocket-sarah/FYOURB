
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TDLogoSVG } from '../TDIcons';
import TDCallSession from './TDCallSession';

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const TDIncomingCall: React.FC<{ onDecline: () => void }> = ({ onDecline }) => {
  const [answered, setAnswered] = useState(false);

  // Auto-play ringer sound effect if desired, or just visual
  return (
    <AnimatePresence>
      {!answered ? (
        /* Fix: Use MotionDiv */
        <MotionDiv 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[1000] bg-zinc-900 flex flex-col items-center justify-between py-24 px-10 text-white font-sans overflow-hidden"
        >
          {/* Background Blurred Glow */}
          <div className="absolute inset-0 bg-[#008A00]/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-8 border border-white/20">
                <TDLogoSVG size={52} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">TD Canada Trust</h1>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs">Security Resolution Node</p>
          </div>

          <div className="flex flex-col items-center gap-4 relative z-10">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
             <p className="text-zinc-500 font-medium text-sm">Priority Neural Uplink...</p>
          </div>

          <div className="w-full flex justify-between items-center relative z-10">
            <button 
              onClick={onDecline}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-900/40 group-active:scale-90 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.17-.18 11.72 11.72 0 0 0 4.39 1.41 1 1 0 0 1 .91 1v3.38a1 1 0 0 1-1.09 1C12.09 23.22 2 13.13 2 3.09a1 1 0 0 1 1-1H6.38a1 1 0 0 1 1 .83 11.72 11.72 0 0 0 1.41 4.39 1 1 0 0 1-.18 1.17z" transform="rotate(135, 12, 12)"/></svg>
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Decline</span>
            </button>

            <button 
              onClick={() => setAnswered(true)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-900/40 group-active:scale-90 transition-transform relative">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/></svg>
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Accept</span>
            </button>
          </div>
        </MotionDiv>
      ) : (
        <TDCallSession onEnd={onDecline} />
      )}
    </AnimatePresence>
  );
};

export default TDIncomingCall;
