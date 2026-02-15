
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share, MoreVertical, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';
import { useDevice } from '../hooks/useDevice';

const InstallOverlay: React.FC = () => {
  const os = useDevice();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const MotionDiv = motion.div as any;

  useEffect(() => {
    // Check if the prompt was already stashed by index.tsx
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    // Listen for the event if it hasn't fired yet
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    setDeferredPrompt(null);
    (window as any).deferredPrompt = null;
    setIsInstalling(false);
  };

  const bypassInstall = () => {
    // Fallback to allow usage if user refuses to install or on desktop
    window.location.reload(); 
    // In many cases, standalone check in App.tsx will still block, 
    // but this gives a way to retry the handshake.
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-zinc-950 flex flex-col items-center justify-center p-8 text-center overflow-hidden select-none font-sans">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4f46e5_0%,_transparent_70%)]"></div>
      </div>

      <MotionDiv 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900 border border-white/5 rounded-[40px] p-10 relative z-10 shadow-2xl"
      >
        <div className="w-20 h-20 bg-indigo-600/10 rounded-[24px] mx-auto mb-8 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
          <Download size={38} className="text-indigo-500" />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tighter mb-4 uppercase">
          Neural Interface Setup
        </h1>
        
        <p className="text-zinc-400 text-sm leading-relaxed mb-10 font-medium px-2">
          Access to Scotiabank High-Fidelity environments and Project Sarah ledgers requires a verified system installation.
        </p>

        <div className="space-y-4 mb-10">
          {deferredPrompt ? (
            <button 
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-[13px] shadow-xl hover:bg-zinc-200 active:scale-95 transition-all"
            >
              {isInstalling ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <ShieldCheck size={18} />
              )}
              {isInstalling ? 'Installing...' : 'Install Application'}
            </button>
          ) : os === 'ios' ? (
            <div className="bg-black/40 rounded-[24px] p-6 text-left border border-white/5 animate-in fade-in">
              <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Smartphone size={14} /> iOS Setup Required
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-[10px] font-bold">1</div>
                  <p className="text-zinc-300 text-xs">Tap <span className="inline-flex items-center p-1 bg-white/10 rounded-md mx-1"><Share size={12} className="text-blue-400" /> Share</span> in Safari.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-[10px] font-bold">2</div>
                  <p className="text-zinc-300 text-xs">Choose <span className="font-bold text-white">"Add to Home Screen"</span>.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black/40 rounded-[24px] p-6 text-left border border-white/5">
               <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Detection Pending</h3>
               <p className="text-zinc-500 text-xs leading-relaxed">
                 Native install prompt not yet triggered. Use your browser menu (<MoreVertical size={12} className="inline" />) to manually "Install App".
               </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-600">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em]">Waiting for System Handshake</p>
          </div>
          
          <button 
            onClick={bypassInstall}
            className="text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group"
          >
            Launch in Browser <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </MotionDiv>

      <div className="mt-8 text-zinc-700 text-[10px] font-bold uppercase tracking-widest">
        Authorized Entry Point Only • RB-OS v7.0.4
      </div>
    </div>
  );
};

export default InstallOverlay;
