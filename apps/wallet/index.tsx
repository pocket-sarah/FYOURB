

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Clock, 
  Settings, 
  Fingerprint, 
  CheckCircle2, 
  ShieldCheck, 
  Ticket,
  // Removed IdCard as it's not exported
  Plane,
  ChevronRight,
  Info,
  Lock,
  ArrowLeft,
  Wifi,
  Check,
  UserCircle // Added UserCircle
} from 'lucide-react';
import { getSystemConfig } from '../../data/systemConfig';

interface WalletAppProps {
  onClose: () => void;
  onNotify: (title: string, message: string, icon: string) => void;
}

interface WalletItem {
  id: string;
  type: 'payment' | 'pass' | 'id';
  bank?: 'scotia' | 'td' | 'bmo' | 'cibc' | 'servus';
  name: string;
  number: string;
  balance?: number;
  cardType?: 'Debit' | 'Credit';
  color: string;
  network?: 'visa' | 'mastercard';
  icon?: React.ReactNode;
  sub?: string;
}

const SUCCESS_CHIME = 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3';

const CardChip = () => (
  <div className="w-12 h-9 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-200 rounded-md relative overflow-hidden shadow-inner border border-black/10">
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-px opacity-30">
      <div className="border-r border-b border-black"></div>
      <div className="border-r border-b border-black"></div>
      <div className="border-b border-black"></div>
      <div className="border-r border-black"></div>
      <div className="border-r border-black"></div>
      <div></div>
    </div>
  </div>
);

const NetworkLogo = ({ type }: { type?: 'visa' | 'mastercard' }) => {
  if (type === 'visa') {
    return <span className="text-white italic font-black text-2xl tracking-tighter">VISA</span>;
  }
  return (
    <div className="flex -space-x-3">
      <div className="w-8 h-8 rounded-full bg-[#EB001B] opacity-90"></div>
      <div className="w-8 h-8 rounded-full bg-[#F79E1B] opacity-90"></div>
    </div>
  );
};

const WalletApp: React.FC<WalletAppProps> = ({ onClose, onNotify }) => {
  const [stage, setStage] = useState<'main' | 'auth' | 'pay' | 'success'>('main');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [detailedItem, setDetailedItem] = useState<WalletItem | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const systemConfig = getSystemConfig();

  const paymentCards: WalletItem[] = useMemo(() => {
    const scotia = systemConfig.scotia_config.accounts.map(acc => ({
      id: `scotia-${acc.name}`,
      type: 'payment' as const,
      bank: 'scotia' as const,
      name: acc.name,
      number: acc.number || '•••• 1029',
      balance: acc.balance,
      cardType: acc.type === 'credit' ? 'Credit' : 'Debit' as any,
      network: 'visa' as const,
      color: 'bg-gradient-to-br from-[#EE0000] via-[#D00000] to-[#900000]'
    }));

    const td = systemConfig.td_config.accounts.map(acc => ({
      id: `td-${acc.name}`,
      type: 'payment' as const,
      bank: 'td' as const,
      name: acc.name,
      number: acc.number || '•••• 1035',
      balance: acc.balance,
      cardType: acc.type === 'credit' ? 'Credit' : 'Debit' as any,
      network: 'mastercard' as const,
      color: 'bg-gradient-to-br from-[#00A300] via-[#008A00] to-[#005A00]'
    }));

    const bmo = systemConfig.bmo_config.accounts.map(acc => ({
      id: `bmo-${acc.name}`,
      type: 'payment' as const,
      bank: 'bmo' as const,
      name: acc.name,
      number: acc.number || '•••• 8271',
      balance: acc.balance,
      cardType: acc.type === 'credit' ? 'Credit' : 'Debit' as any,
      network: 'mastercard' as const,
      color: 'bg-gradient-to-br from-[#0079C1] via-[#005ea2] to-[#004a80]'
    }));

    const cibc = systemConfig.cibc_config.accounts.map(acc => ({
      id: `cibc-${acc.name}`,
      type: 'payment' as const,
      bank: 'cibc' as const,
      name: acc.name,
      number: acc.number || '•••• 4482',
      balance: acc.balance,
      cardType: acc.type === 'credit' ? 'Credit' : 'Debit' as any,
      network: 'visa' as const,
      color: 'bg-gradient-to-br from-[#9D2235] via-[#7d1b2a] to-[#5d141f]'
    }));

    const servus = systemConfig.servus_config.accounts.map(acc => ({
      id: `servus-${acc.name}`,
      type: 'payment' as const,
      bank: 'servus' as const,
      name: acc.name,
      number: acc.number || '•••• 1029',
      balance: acc.balance,
      cardType: acc.type === 'credit' ? 'Credit' : 'Debit' as any,
      network: 'mastercard' as const,
      color: 'bg-gradient-to-br from-[#00A3A1] via-[#008a88] to-[#007170]'
    }));

    return [...scotia, ...td, ...bmo, ...cibc, ...servus];
  }, [systemConfig]);

  const passes: WalletItem[] = [
    { id: 'flight', type: 'pass', name: 'SFO ✈ JFK', number: 'UA882', color: 'bg-[#1e293b]', icon: <Plane className="text-indigo-400" />, sub: 'Boarding at 7:20 AM' },
    { id: 'walgreens', type: 'pass', name: 'Walgreens Rewards', number: '9283-1102', color: 'bg-[#1c1c1e]', icon: <Ticket className="text-red-500" />, sub: '12,450 Points' },
    { id: 'dl', type: 'id', name: 'Driver License', number: 'ID-4839-291', color: 'bg-[#1c1c1e]', icon: <UserCircle className="text-orange-500" />, sub: 'Verified by RMV' },
  ];

  const handlePayInitiate = async (cardIdx?: number) => {
    if (stage !== 'main') return;
    
    if (typeof cardIdx === 'number') {
        setSelectedIdx(cardIdx);
    }

    setStage('auth');
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    
    setTimeout(async () => {
      setStage('pay');
      
      if ('NDEFReader' in window) {
        try {
          const reader = new (window as any).NDEFReader();
          await reader.scan();
        } catch (error) {
          console.warn("Hardware NFC interface unavailable.");
        }
      }

      // Emulate Contact Handshake after 3.5 seconds
      setTimeout(() => {
          if (navigator.vibrate) navigator.vibrate(250);
          
          // Play Success Chime
          if (!audioRef.current) {
            audioRef.current = new Audio(SUCCESS_CHIME);
          }
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.log("Audio blocked", e));
          
          setStage('success');
          onNotify("Wallet", "Payment Successful", 'https://cdn-icons-png.flaticon.com/512/1052/1052873.png');
      }, 3500);
    }, 1800);
  };

  const activeCard = paymentCards[selectedIdx];
  const MotionDiv = motion.div as any;

  const renderCardClone = (item: WalletItem, isActive: boolean, layoutId?: string) => {
    let bankName = 'Bank';
    if (item.bank === 'scotia') bankName = 'Scotiabank';
    if (item.bank === 'td') bankName = 'TD Trust';
    if (item.bank === 'bmo') bankName = 'BMO';
    if (item.bank === 'cibc') bankName = 'CIBC';
    if (item.bank === 'servus') bankName = 'Servus';

    return (
        <MotionDiv
          key={item.id}
          layoutId={layoutId}
          whileTap={{ scale: 0.98 }}
          className={`snap-center shrink-0 w-[calc(100vw-48px)] aspect-[1.58/1] ${item.color} rounded-[32px] p-8 shadow-2xl flex flex-col justify-between transition-all duration-700 border border-white/10 relative overflow-hidden ${isActive ? 'ring-2 ring-white/40 scale-100' : 'scale-90 opacity-30 blur-[2px]'}`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-3xl rounded-full -mr-24 -mt-24"></div>
          <div className="flex justify-between items-start z-10">
             <div className="flex flex-col">
                <span className="text-white font-black text-xl tracking-tighter uppercase leading-none">
                  {bankName}
                </span>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1.5">{item.cardType}</span>
             </div>
             <div className="opacity-60">
                <Wifi className="w-8 h-8 rotate-90" strokeWidth={2.5} />
             </div>
          </div>
          <div className="z-10"><CardChip /></div>
          <div className="flex justify-between items-end z-10">
             <div className="space-y-1">
                <p className="text-white font-mono text-xl tracking-[0.35em]">{item.number}</p>
                <p className="text-white/60 font-bold text-[12px] uppercase tracking-[0.25em]">{systemConfig.general.sender_name}</p>
             </div>
             <div className="pb-1"><NetworkLogo type={item.network} /></div>
          </div>
        </MotionDiv>
      );
  }

  return (
    <div className="absolute inset-0 bg-black text-white flex flex-col font-sans overflow-hidden">
      <AnimatePresence>
        {detailedItem && (
          <MotionDiv
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute inset-0 z-[1000] bg-zinc-950 flex flex-col"
          >
            <header className="pt-14 px-6 pb-6 flex items-center gap-4 border-b border-white/5">
                <button onClick={() => setDetailedItem(null)} className="p-2 -ml-2 rounded-full bg-white/5"><ArrowLeft size={20} /></button>
                <h2 className="text-lg font-bold">Credential Registry</h2>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                <div className="flex justify-center">{renderCardClone(detailedItem, true)}</div>
                <div className="space-y-4">
                    <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest px-2">Management Matrix</h3>
                    <div className="bg-zinc-900/50 rounded-[32px] border border-white/5 divide-y divide-white/5 overflow-hidden">
                        {[
                            { label: 'Neural Freeze', icon: <Lock size={18} />, color: 'text-zinc-400' },
                            { label: 'Telemetry Logs', icon: <Clock size={18} />, color: 'text-indigo-400' },
                            { label: 'Security Handshake', icon: <ShieldCheck size={18} />, color: 'text-emerald-400' }
                        ].map((act, i) => (
                            <button key={i} className="w-full p-6 flex items-center justify-between active:bg-white/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={act.color}>{act.icon}</div>
                                    <span className="font-bold text-sm">{act.label}</span>
                                </div>
                                <ChevronRight size={16} className="opacity-20" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <header className="pt-14 px-8 pb-6 flex justify-between items-center z-50 shrink-0">
        <h1 className="text-3xl font-black tracking-tighter">Wallet</h1>
        <div className="flex items-center gap-4">
          <button className="w-11 h-11 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center active:scale-90 transition-all shadow-xl"><Plus size={24} /></button>
          <div className="w-11 h-11 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center active:scale-90 transition-all"><Settings size={20} className="text-zinc-500" /></div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Interaction Node - Hidden now that cards trigger pay */}
        <div className="flex justify-center py-12">
          <div className="relative flex items-center justify-center w-64 h-64 opacity-20">
             <div className="absolute inset-0 border border-white/[0.03] rounded-full scale-110"></div>
             <MotionDiv className="relative z-10 p-10 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col items-center justify-center">
                <Wifi className="w-24 h-24 rotate-90 text-zinc-700" strokeWidth={2.5} />
             </MotionDiv>
          </div>
        </div>

        {/* Full-Width Payment Hero Carousel */}
        <div className="relative mt-2">
          <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x px-6">
            {paymentCards.map((card, i) => (
              <div key={card.id} onClick={() => handlePayInitiate(i)}>
                {renderCardClone(card, selectedIdx === i, `card-${card.id}`)}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
             {paymentCards.map((_, i) => (
               <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${selectedIdx === i ? 'bg-indigo-500 w-12' : 'bg-zinc-800 w-3'}`} />
             ))}
          </div>
        </div>

        {/* Credentials Grid */}
        <section className="px-6 space-y-4 mt-12">
          <div className="flex justify-between items-center px-2">
              <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Matrix Passes</h3>
              <span className="text-indigo-500 font-bold text-xs">Manage</span>
          </div>
          <div className="grid grid-cols-1 gap-4 pb-20">
             {passes.map(pass => (
               <MotionDiv 
                key={pass.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDetailedItem(pass)}
                className={`${pass.color} border border-white/5 p-7 rounded-[40px] flex items-center gap-6 group cursor-pointer hover:border-white/10 transition-colors shadow-2xl`}
               >
                  <div className="w-14 h-14 rounded-[22px] bg-white/5 flex items-center justify-center text-3xl shrink-0 border border-white/5">
                    {pass.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-[18px] tracking-tight">{pass.name}</p>
                    <p className="text-zinc-500 text-xs font-medium mt-1 uppercase tracking-[0.15em]">{pass.sub}</p>
                  </div>
                  <ChevronRight size={18} className="text-zinc-800 group-hover:text-white transition-colors" />
               </MotionDiv>
             ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {stage === 'auth' && (
          <MotionDiv 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[2000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center"
          >
             <MotionDiv 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-32 h-32 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-500 mb-12 border border-indigo-500/10 shadow-[0_0_80px_rgba(99,102,241,0.2)]"
             >
                <Fingerprint size={80} strokeWidth={1} />
             </MotionDiv>
             <h2 className="text-2xl font-black uppercase tracking-[0.4em]">Biometric Auth</h2>
             <p className="text-zinc-600 text-sm mt-4 leading-relaxed font-bold tracking-tight">Accessing Secure Enclave...</p>
          </MotionDiv>
        )}

        {(stage === 'pay' || stage === 'success') && (
          <MotionDiv 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[2100] bg-[#f9f9f9] flex flex-col items-center justify-start pt-16 text-center overflow-hidden"
          >
             {/* Dynamic Rings Background */}
             <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-96 h-96 rounded-full border-[2px] border-blue-500/5"></div>
                <div className="absolute w-80 h-80 rounded-full border-[2px] border-blue-500/10"></div>
                <div className="absolute w-64 h-64 rounded-full border-[2px] border-blue-500/20"></div>
                
                <AnimatePresence>
                  {stage === 'pay' && [1, 2, 3].map((i) => (
                    <MotionDiv
                      key={i}
                      initial={{ scale: 0.1, opacity: 0.8 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 0.9,
                        ease: "easeOut"
                      }}
                      className="absolute inset-0 border-[2px] border-blue-400/30 rounded-full"
                    />
                  ))}
                </AnimatePresence>

                {/* Central Icon / Checkmark Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {stage === 'pay' ? (
                      <MotionDiv
                        key="nfc-icon"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-24 h-24 bg-white rounded-full shadow-lg border border-blue-50/50 flex items-center justify-center text-blue-600 z-50"
                      >
                        <Wifi className="w-12 h-12 rotate-90" strokeWidth={3} />
                      </MotionDiv>
                    ) : (
                      <MotionDiv
                        key="check-icon"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 bg-white rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-green-50 flex items-center justify-center text-green-600 z-50"
                      >
                         <MotionDiv
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: 1 }}
                           transition={{ duration: 0.5, delay: 0.2 }}
                         >
                           <Check size={48} strokeWidth={4} />
                         </MotionDiv>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </div>
             </div>
             
             <div className="mt-[280px] w-full flex flex-col items-center">
                <h2 className="text-gray-900 font-bold text-2xl mb-8 tracking-tight">
                  {stage === 'pay' ? 'Ready to pay' : 'Payment Successful'}
                </h2>
                
                <div className="w-full max-w-[340px] px-6">
                    <MotionDiv
                      layoutId={`card-${activeCard.id}`}
                      animate={stage === 'success' ? { y: 20, opacity: 0.6, scale: 0.95 } : {}}
                      className={`aspect-[1.58/1] ${activeCard.color} rounded-[28px] p-7 shadow-2xl flex flex-col justify-between border border-white/10 relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-24 -mt-24"></div>
                      <div className="flex justify-between items-start z-10 text-left">
                        <div className="flex flex-col">
                            <span className="text-white font-black text-lg tracking-tighter uppercase leading-none">
                                {activeCard.bank === 'scotia' ? 'Scotiabank' : 
                                 activeCard.bank === 'td' ? 'TD Trust' :
                                 activeCard.bank === 'bmo' ? 'BMO' :
                                 activeCard.bank === 'cibc' ? 'CIBC' :
                                 activeCard.bank === 'servus' ? 'Servus' : 'Bank'}
                            </span>
                            <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mt-1.5">{activeCard.cardType}</span>
                        </div>
                        <div className="opacity-60">
                            <Wifi className="w-6 h-6 rotate-90" strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="z-10 text-left"><CardChip /></div>
                      <div className="flex justify-between items-end z-10 text-left">
                        <div className="space-y-1">
                            <p className="text-white font-mono text-lg tracking-[0.35em]">{activeCard.number}</p>
                            <p className="text-white/60 font-bold text-[11px] uppercase tracking-widest">{systemConfig.general.sender_name}</p>
                        </div>
                        <div className="pb-1"><NetworkLogo type={activeCard.network} /></div>
                      </div>
                    </MotionDiv>
                </div>

                <AnimatePresence>
                  {stage === 'success' && (
                    <MotionDiv
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 w-full px-8"
                    >
                      <button 
                        onClick={() => setStage('main')}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg active:scale-95 transition-all text-[15px]"
                      >
                        Continue
                      </button>
                    </MotionDiv>
                  )}
                </AnimatePresence>

                {stage === 'pay' && (
                  <div className="mt-12 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                    <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.5em]">NFC Signal Active</p>
                  </div>
                )}
             </div>
          </MotionDiv>
        )}
      </AnimatePresence>
      <audio ref={audioRef} src={SUCCESS_CHIME} hidden />
    </div>
  );
};

export default WalletApp;
