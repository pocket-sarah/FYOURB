
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';
import { TDLogoSVG } from '../TDIcons';
import { getSystemConfig } from '../../../data/systemConfig';

// High-fidelity corporate hold music loop (Opus No. 1)
const HOLD_MUSIC_URL = 'https://archive.org/download/mon-opus-1/Cisco_Default_Hold_Music_Opus_Number_1.mp3';

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const TDCallSession: React.FC<{ onEnd: () => void }> = ({ onEnd }) => {
  const [status, setStatus] = useState('Connecting...');
  const [isHold, setIsHold] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [connectionStatic, setConnectionStatic] = useState(0);
  const [agentName, setAgentName] = useState('Raj');
  const [agentTitle, setAgentTitle] = useState('TD Global Resolution');

  const aiRef = useRef<any>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputGainNodeRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const holdMusicRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCallTime(prev => prev + 1), 1000);
    
    // Simulate periodic line noise/static
    const staticInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setConnectionStatic(Math.random());
        setTimeout(() => setConnectionStatic(0), 150);
      }
    }, 4000);

    // Start Hold Music
    holdMusicRef.current = new Audio(HOLD_MUSIC_URL);
    holdMusicRef.current.loop = true;
    holdMusicRef.current.volume = 0.4;
    holdMusicRef.current.play().catch(e => console.log("Hold music blocked", e));

    // Agent joins after 7 seconds
    const holdTimer = setTimeout(() => {
        playConnectBeep();
        setIsHold(false);
        setStatus('Call Active');
        if (holdMusicRef.current) {
            holdMusicRef.current.pause();
            holdMusicRef.current = null;
        }
        initializeNeuralUplink();
    }, 7000);

    return () => {
        clearInterval(timer);
        clearInterval(staticInterval);
        clearTimeout(holdTimer);
        terminateNeuralUplink();
        if (holdMusicRef.current) holdMusicRef.current.pause();
    };
  }, []);

  const playConnectBeep = () => {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
  };

  const initializeNeuralUplink = async () => {
    try {
      const config = getSystemConfig();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      aiRef.current = ai;

      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const gainNode = outputAudioContext.createGain();
      // media_volume from config (75%) used as multiplier for lower volume preference
      gainNode.gain.value = (config.sound_vibration.media_volume / 100) * 0.25; 
      gainNode.connect(outputAudioContext.destination);
      outputGainNodeRef.current = gainNode;
      
      await inputAudioContext.resume();
      await outputAudioContext.resume();
      
      audioContextRef.current = outputAudioContext;
      inputAudioContextRef.current = inputAudioContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const systemInstruction = `You are "Raj", a senior support specialist at a TD-owned Global Service Center. 
      
      PERSONALITY & ACCENT:
      - Sound like a professional East Indian call center agent. 
      - Be extremely polite, formal, and helpful. 
      - Always address the user as "Sir" or "Ma'am".
      - Use phrases like "I can definitely help you with that today, Sir," and "Thank you for your patience, Ma'am."
      
      SIMPLE WORDING:
      - Use "stupid" metaphors for banking issues. NO jargon.
      - "The digital pipe for your money is a bit full today because so many people are sending transfers."

      GREETING:
      "Hello? Good day to you, Ma'am/Sir. My name is Raj, calling from the TD Global Resolution Center. Am I speaking with ${config.general.sender_name} today?"`;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Active');
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                try { session.sendRealtimeInput({ media: pcmBlob }); } catch (err) {}
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
              const source = outputAudioContext.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(gainNode);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => setStatus('Line Error'),
          onclose: (e) => setStatus('Call Ended'),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          thinkingConfig: { thinkingBudget: 4000 },
          systemInstruction,
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error("Call failed:", err);
      setStatus('Call Failed');
    }
  };

  const terminateNeuralUplink = () => {
    if (sessionRef.current) try { sessionRef.current.close(); } catch (e) {}
    sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
    if (inputAudioContextRef.current) try { inputAudioContextRef.current.close(); } catch (e) {}
    if (audioContextRef.current) try { audioContextRef.current.close(); } catch (e) {}
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
  };

  const CallControlButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, isActive?: boolean }> = ({ icon, label, onClick, isActive }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center border border-white/5 transition-colors ${isActive ? 'bg-white text-black' : 'bg-white/5 text-white'}`}>
            {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
    </button>
  );

  return (
    <div className="absolute inset-0 z-[1100] bg-gradient-to-br from-[#005a00] to-black flex flex-col items-center py-20 px-8 text-white font-sans overflow-hidden">
        {/* Fix: Use MotionDiv */}
        <MotionDiv animate={{ opacity: connectionStatic * 0.08 }} className="absolute inset-0 bg-white pointer-events-none z-0" />

        <div className="flex flex-col items-center gap-2 mb-16 relative z-10">
            <h1 className="text-4xl font-black tracking-tight text-white">{agentName}</h1>
            <p className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-xs">{agentTitle}</p>
        </div>

        <div className="text-6xl font-light tracking-tighter mb-12 text-white/90 tabular-nums relative z-10">
            {formatTime(callTime)}
        </div>
        
        <div className="flex items-center gap-3 mb-10 relative z-10">
            <div className={`w-2 h-2 rounded-full ${isHold ? 'bg-zinc-600' : 'bg-green-500 animate-pulse'}`}></div>
            <p className={`${isHold ? 'text-zinc-500' : 'text-green-400'} font-bold text-xs uppercase tracking-[0.3em]`}>{status}</p>
        </div>

        <div className="w-full flex-1 flex flex-col items-center relative z-10">
            {isHold && (
                <div className="flex flex-col items-center gap-6 animate-in fade-in">
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest text-center">Connecting to Global Center...</p>
                    <div className="flex gap-2 h-10 items-end">
                        {Array.from({ length: 12 }).map((_, i) => (
                            /* Fix: Use MotionDiv */
                            <MotionDiv 
                                key={i}
                                animate={{ height: [15, 40, 20, 35] }}
                                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.08 }}
                                className="w-1.5 bg-green-500/30 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Call Controls Grid */}
        <div className="grid grid-cols-3 gap-y-10 gap-x-6 w-full max-w-sm mb-16 relative z-10">
            <CallControlButton 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/></svg>} 
                label="Mute" 
                onClick={() => setIsMuted(!isMuted)} 
                isActive={isMuted} 
            />
            <CallControlButton 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>} 
                label="Keypad" 
            />
            <CallControlButton 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 5L6 9H2v6h4l5 4V5Z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>} 
                label="Speaker" 
            />
            <CallControlButton 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>} 
                label="Add call" 
            />
            <CallControlButton 
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3v18M16 3v18"/></svg>} 
                label="Hold" 
            />
            <CallControlButton 
                icon={<TDLogoSVG size={24} />} 
                label="TD Chat" 
            />
        </div>

        <button 
            onClick={onEnd}
            className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-900/40 active:scale-90 transition-transform mb-10 relative z-10"
        >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white" transform="rotate(135)"><path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/></svg>
        </button>
    </div>
  );
};

export default TDCallSession;
