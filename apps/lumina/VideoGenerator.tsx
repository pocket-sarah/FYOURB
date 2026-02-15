
import React, { useState } from 'react';
import { GeminiService } from '../../services/gemini';
import { GeneratedAsset } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const VideoGenerator: React.FC<{ onNotify: any }> = ({ onNotify }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [gallery, setGallery] = useState<GeneratedAsset[]>(() => {
    const saved = localStorage.getItem('lumina_video_gallery');
    return saved ? JSON.parse(saved) : [];
  });

  const loadingMessages = [
    "Establishing Neural Uplink...",
    "Allocating Tensor Clusters...",
    "Synthesizing Temporal Frames...",
    "Finalizing Kinetic Rendering...",
    "Encrypting Video Stream..."
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    let msgIndex = 0;
    const interval = setInterval(() => {
        setStatusMessage(loadingMessages[msgIndex % loadingMessages.length]);
        msgIndex++;
    }, 4000);

    try {
      setStatusMessage(loadingMessages[0]);
      const url = await GeminiService.generateVideo(prompt);
      const newAsset: GeneratedAsset = {
        id: Date.now().toString(),
        type: 'video',
        url,
        prompt,
        timestamp: Date.now(),
      };
      const updatedGallery = [newAsset, ...gallery];
      setGallery(updatedGallery);
      localStorage.setItem('lumina_video_gallery', JSON.stringify(updatedGallery));
      onNotify("Temporal Synthesis Complete", "Your kinematic asset is ready.", "https://cdn-icons-png.flaticon.com/512/3953/3953226.png");
    } catch (err) {
      alert('Neural Matrix Timed Out. Retrying operation...');
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      <div className="w-full lg:w-80 bg-slate-950 border-r border-white/5 p-6 flex flex-col gap-8 shrink-0">
          <div>
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4 opacity-40">Temporal Matrix</h3>
              <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Kinetic Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A drone flying through a neon cyberpunk city in heavy rain..."
                        className="w-full h-32 bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50 resize-none text-white font-medium"
                    />
                  </div>
                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                      <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest leading-relaxed">
                          Research Note: Video generation utilizing Veo-3.1-Fast. Average synthesis time: 45-90 seconds.
                      </p>
                  </div>
              </div>
          </div>

          <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="mt-auto w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px]"
          >
              {isGenerating ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                </>
              ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Generate Motion</span>
                </>
              )}
          </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-black relative">
          {isGenerating && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 mb-8 relative">
                      <div className="absolute inset-0 border-4 border-indigo-600/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                  <h2 className="text-white font-black text-xl mb-2 tracking-tighter uppercase">{statusMessage}</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">Kinetic Matrix Stabilizing</p>
              </div>
          )}

          {gallery.length === 0 ? (
            <div className="h-full border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-slate-700 gap-6 opacity-40">
                <div className="w-20 h-20 rounded-full border-2 border-slate-800 flex items-center justify-center">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <p className="font-black text-xs uppercase tracking-[0.4em]">Temporal Buffer Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 pb-20 max-w-3xl mx-auto">
                <AnimatePresence>
                    {gallery.map((asset) => (
                        /* Fix: Use MotionDiv */
                        <MotionDiv 
                            key={asset.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 rounded-[32px] overflow-hidden border border-white/5 shadow-2xl"
                        >
                            <div className="relative aspect-video bg-slate-950">
                                <video src={asset.url} className="w-full h-full object-cover" controls autoPlay loop muted />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white/50 hover:text-white transition-all flex items-center justify-center"
                                        onClick={() => {
                                            const next = gallery.filter(g => g.id !== asset.id);
                                            setGallery(next);
                                            localStorage.setItem('lumina_video_gallery', JSON.stringify(next));
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-white text-sm font-medium leading-relaxed opacity-80">{asset.prompt}</p>
                            </div>
                        </MotionDiv>
                    ))}
                </AnimatePresence>
            </div>
          )}
      </div>
    </div>
  );
};

export default VideoGenerator;
