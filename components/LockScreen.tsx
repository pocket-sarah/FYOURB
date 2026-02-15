import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSystemConfig } from '../data/systemConfig';
import { ShieldCheck, PhoneCall } from 'lucide-react';

interface LockScreenProps {
  onUnlock: (mode: 'god' | 'standard' | 'user') => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState(false);
  const [view, setView] = useState<'lock' | 'pin'>('lock');
  const [time, setTime] = useState(new Date());
  const config = getSystemConfig();
  
  const GOD_PIN = '696969';
  const STANDARD_PIN = '000000';
  const MIDDLE_PIN = '2580'; 

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlockTrigger = () => {
    const currentConfig = getSystemConfig();
    const isTokenLockEnabled = currentConfig.privacy_security.token_lock_enabled;
    
    if (!isTokenLockEnabled) {
      setView('pin');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('token') === 'PROJECTSARAH') {
      setView('pin');
    } else {
      window.location.href = 'https://etransfer.interac.ca/error';
    }
  };

  const handleKeypad = (val: string) => {
    setError(false);
    const newPin = pin + val;
    if (newPin.length > 6) return;
    setPin(newPin);

    if (newPin === MIDDLE_PIN) {
      onUnlock('user');
      return;
    }

    if (newPin.length === 6) {
      if (newPin === GOD_PIN) {
        onUnlock('god');
      } else if (newPin === STANDARD_PIN) {
        onUnlock('standard');
      } else {
        setError(true);
        if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 600);
      }
    }
  };

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });

  const MotionDiv = motion.div as any;
  const MotionButton = motion.button as any;

  return (
    <div className="h-screen w-full relative bg-black overflow-hidden select-none font-sans shadow-crt">
      {/* Dynamic Wallpaper Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
        style={{ 
          backgroundImage: `url(${config.display.wallpaper_url})`,
          filter: view === 'pin' ? 'blur(40px) brightness(0.5)' : 'none',
          transform: view === 'pin' ? 'scale(1.1)' : 'scale(1)'
        }}
      />

      {/* Main Lock View */}
      <AnimatePresence mode="wait">
        {view === 'lock' && (
          <MotionDiv 
            key="lock-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 flex flex-col items-center justify-between py-20 px-10 z-10 cursor-pointer"
            onClick={handleUnlockTrigger}
          >
            {/* Clock Area */}
            <div className="flex flex-col items-center mt-12">
               <div className="flex flex-col items-center leading-none text-white font-light">
                  <span className="text-[100px] android-clock">{hours}</span>
                  <span className="text-[100px] android-clock -mt-8">{minutes}</span>
               </div>
               <p className="mt-4 text-lg font-medium text-white/90 tracking-wide">{dateStr}</p>
               
               {/* Grayscale Notification Icons (Android 15 style) */}
               <div className="flex gap-4 mt-8 opacity-40">
                  <div className="w-5 h-5 rounded-full bg-white/20" />
                  <div className="w-5 h-5 rounded-full bg-white/20" />
                  <div className="w-5 h-5 rounded-full bg-white/20" />
               </div>
            </div>

            {/* Bottom Interaction Area */}
            <div className="flex flex-col items-center w-full mb-12">
               <p className="text-sm font-medium text-white/60 tracking-wider">Swipe up or tap to unlock</p>
            </div>
          </MotionDiv>
        )}

        {view === 'pin' && (
          <MotionDiv 
            key="pin-view"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-10 z-20"
          >
            <div className="text-center mb-16">
              <ShieldCheck className="w-12 h-12 text-white/40 mx-auto mb-6" />
              <h2 className="text-lg font-semibold text-white mb-6">Enter PIN</h2>
              
              {/* PIN Indicator Dots */}
              <div className="flex gap-6 justify-center">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3.5 h-3.5 rounded-full border border-white/30 transition-all duration-300 ${
                      pin.length > i ? 'bg-white scale-110' : 'bg-transparent'
                    } ${error ? 'animate-shake bg-red-500 border-red-500' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Android 15 Round Keypad */}
            <div className="grid grid-cols-3 gap-x-10 gap-y-6 w-full max-w-[320px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <MotionButton 
                  key={n} 
                  whileTap={{ scale: 0.9, backgroundColor: "rgba(255,255,255,0.2)" }}
                  onClick={() => handleKeypad(n.toString())}
                  className="w-full aspect-square rounded-full flex items-center justify-center text-3xl font-normal text-white bg-white/5 backdrop-blur-sm transition-colors"
                >
                  {n}
                </MotionButton>
              ))}
              <MotionButton 
                whileTap={{ scale: 0.9 }}
                onClick={() => { setView('lock'); setPin(''); }}
                className="flex items-center justify-center text-sm font-bold text-white/60 hover:text-white transition-colors"
              >
                Back
              </MotionButton>
              <MotionButton 
                whileTap={{ scale: 0.9, backgroundColor: "rgba(255,255,255,0.2)" }}
                onClick={() => handleKeypad('0')}
                className="w-full aspect-square rounded-full flex items-center justify-center text-3xl font-normal text-white bg-white/5 backdrop-blur-sm transition-colors"
              >
                0
              </MotionButton>
              <MotionButton 
                whileTap={{ scale: 0.9 }}
                onClick={() => setPin(pin.slice(0, -1))}
                className="flex items-center justify-center text-white/60 active:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
              </MotionButton>
            </div>

            <button 
              className="mt-16 text-sm font-bold text-white/40 hover:text-white/80 transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Emergency Call
            </button>
          </MotionDiv>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .android-clock {
          font-family: 'Outfit', sans-serif;
          font-weight: 200;
          letter-spacing: -2px;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }
      `}</style>
    </div>
  );
};

export default LockScreen;