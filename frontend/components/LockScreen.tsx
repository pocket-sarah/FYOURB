
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LockScreenProps {
  onUnlock: (mode: 'god' | 'standard' | 'user') => void;
}

const MotionDiv = motion.div as any;

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState<string>('');
  const [view, setView] = useState<'wallpaper' | 'passcode'>('wallpaper');
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSwipeUp = () => setView('passcode');

  const handleKeypad = (val: string) => {
    const newPin = pin + val;
    setPin(newPin);
    if (newPin.length === 6) {
      if (newPin === '000000') onUnlock('standard');
      else if (newPin === '696969') onUnlock('god');
      else if (newPin === '123456') onUnlock('user');
      else setTimeout(() => setPin(''), 500);
    }
  };

  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });
  const hours = time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false });
  const minutes = time.toLocaleTimeString('en-US', { minute: '2-digit' }).padStart(2, '0');

  return (
    <div className="absolute inset-0 bg-black overflow-hidden font-sans select-none text-white z-[5000]">
      <MotionDiv 
        className="absolute inset-0 bg-cover bg-center"
        initial={{ scale: 1 }}
        animate={{ 
            scale: view === 'passcode' ? 1.1 : 1,
            filter: view === 'passcode' ? 'blur(20px) brightness(0.5)' : 'blur(0px) brightness(1)'
        }}
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop')` }}
      />

      <AnimatePresence>
        {view === 'wallpaper' && (
            <MotionDiv 
                className="absolute inset-0 flex flex-col pt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -100 }}
                onClick={handleSwipeUp}
            >
                <div className="px-8 mt-10">
                    <div className="text-[96px] leading-[0.8] font-black tracking-tighter text-white/90 drop-shadow-2xl">
                        {hours}
                        <div className="text-indigo-500">{minutes}</div>
                    </div>
                    <div className="text-lg font-bold mt-6 text-white/60 tracking-widest uppercase">
                        {dateStr}
                    </div>
                </div>

                <div className="mt-auto mb-16 px-8 flex flex-col items-center gap-10">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center animate-pulse">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 animate-pulse">Swipe Up To Decrypt</p>
                        <div className="w-40 h-1 bg-white/20 rounded-full overflow-hidden">
                             <MotionDiv animate={{ x: [-160, 160] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-20 h-full bg-indigo-500" />
                        </div>
                    </div>
                </div>
            </MotionDiv>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view === 'passcode' && (
            <MotionDiv 
                className="absolute inset-0 flex flex-col items-center justify-center pt-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="w-16 h-16 rounded-full border-2 border-indigo-500 flex items-center justify-center mb-8">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <p className="text-xs font-black mb-10 tracking-[0.4em] uppercase text-indigo-400">Identity Protocol</p>
                
                <div className="flex gap-4 mb-16">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`w-3.5 h-3.5 rounded-full border-2 border-white/20 transition-all ${i < pin.length ? 'bg-indigo-500 border-indigo-400 scale-110 shadow-[0_0_15px_#6366f1]' : 'bg-transparent'}`} />
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <button key={n} onClick={() => handleKeypad(n.toString())} className="w-20 h-20 rounded-full bg-white/5 border border-white/5 active:bg-indigo-500/20 active:border-indigo-500/50 transition-all flex flex-col items-center justify-center">
                            <span className="text-3xl font-light">{n}</span>
                        </button>
                    ))}
                    <div />
                    <button onClick={() => handleKeypad('0')} className="w-20 h-20 rounded-full bg-white/5 border border-white/5 active:bg-indigo-500/20 transition-all flex items-center justify-center">
                        <span className="text-3xl font-light">0</span>
                    </button>
                    <button onClick={() => setView('wallpaper')} className="w-20 h-20 flex items-center justify-center text-white/40 font-black uppercase text-[10px] tracking-widest">Back</button>
                </div>
            </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LockScreen;
