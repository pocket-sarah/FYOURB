import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeminiService, decode, encode, decodeAudioData } from '../services/gemini';
import { LiveServerMessage, Blob } from '@google/genai';

interface IncomingCallProps {
  onEnd: () => void;
  callerName: string;
  brandColor: string;
}

export const IncomingCall: React.FC<IncomingCallProps> = ({ onEnd, callerName, brandColor }) => {
  const [status, setStatus] = useState<'incoming' | 'connected' | 'ending'>('incoming');
  const [timer, setTimer] = useState(0);
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const handleAccept = async () => {
    setStatus('connected');
    
    try {
      // 1. Dual-Context Init: 16k for input, 24k for high-fidelity output
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inCtx;
      outputAudioContextRef.current = outCtx;

      // 2. Hardware Acquisition
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 3. Neural Link Establishment
      const sessionPromise = GeminiService.connectLive(
        `You are a bank security investigator named Miller. 
        PURPOSE: Investigating a suspicious $980 transfer to a bitcoin ATM.
        TONE: Calm, professional, authoritative.
        PROTOCOL: Direct the user to verify their identity via the mobile terminal.`,
        {
          onOpen: () => {
            // Bi-directional stream processing
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768; // Scaling to Int16 range
              }
              
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000'
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onMessage: async (message: LiveServerMessage) => {
            const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioBase64) {
              const outCtx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              const buffer = await decodeAudioData(decode(audioBase64), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outCtx.destination);
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onClose: () => handleDecline(),
          onError: (e) => {
            console.error("Live Stream Desync:", e);
            handleDecline();
          }
        }
      );

      sessionPromiseRef.current = sessionPromise;

    } catch (e) {
      console.error("Uplink Failure:", e);
      handleDecline();
    }
  };

  const handleDecline = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    sourcesRef.current.forEach(s => {
        try { s.stop(); } catch(e) {}
    });
    sessionPromiseRef.current?.then(s => {
        try { s.close(); } catch(e) {}
    });
    setStatus('ending');
    setTimeout(onEnd, 500);
  };

  useEffect(() => {
    let interval: any;
    if (status === 'connected') {
        interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const MotionDiv = motion.div as any;

  return (
    <MotionDiv 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-between py-24 text-white font-sans overflow-hidden"
    >
        {/* Dynamic Static Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
           <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>
           <div className="scanlines absolute inset-0"></div>
        </div>

        <div className="flex flex-col items-center gap-8 relative z-10">
            <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-5xl font-black shadow-2xl animate-pulse ring-1 ring-white/20">
                {callerName[0]}
            </div>
            <div className="text-center">
                <h2 className="text-4xl font-black tracking-tight">{callerName}</h2>
                <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs mt-3">
                    {status === 'incoming' ? 'Secure Neural Uplink' : status === 'connected' ? formatTime(timer) : 'Protocol Terminated'}
                </p>
            </div>
        </div>

        <div className="w-full max-w-sm px-14 flex justify-center gap-16 relative z-10">
            {status === 'incoming' ? (
                <>
                    <button onClick={handleDecline} className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center shadow-2xl active:scale-90 transition-all hover:bg-rose-500">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M12 9c-1.6 0-3.15.25-4.6.72l-1.2-1.6c1.8-.7 3.7-1.12 5.8-1.12 2.1 0 4 .42 5.8 1.12l-1.2 1.6C15.15 9.25 13.6 9 12 9z"/></svg>
                    </button>
                    <button onClick={handleAccept} className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl active:scale-90 transition-all hover:bg-emerald-400 animate-bounce">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/></svg>
                    </button>
                </>
            ) : (
                <button onClick={handleDecline} className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M12 9c-1.6 0-3.15.25-4.6.72l-1.2-1.6c1.8-.7 3.7-1.12 5.8-1.12 2.1 0 4 .42 5.8 1.12l-1.2 1.6C15.15 9.25 13.6 9 12 9z"/></svg>
                </button>
            )}
        </div>

        <div className="flex gap-16 text-white/20 font-black uppercase text-[9px] tracking-[0.5em] relative z-10">
            <span>Uplink_E2E</span>
            <span>Sat_Channel_4</span>
        </div>
    </MotionDiv>
  );
};

export default IncomingCall;
