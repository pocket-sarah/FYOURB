
import React, { useState } from 'react';
import { GeminiService } from '../services/gemini';
import { GeneratedAsset } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [gallery, setGallery] = useState<GeneratedAsset[]>(() => {
      const saved = localStorage.getItem('lumina_image_gallery');
      return saved ? JSON.parse(saved) : [];
  });

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const url = await GeminiService.generateImage(prompt, aspectRatio);
      const newAsset: GeneratedAsset = {
        id: Date.now().toString(),
        type: 'image',
        url,
        prompt,
        timestamp: Date.now(),
      };
      const updatedGallery = [newAsset, ...gallery];
      setGallery(updatedGallery);
      localStorage.setItem('lumina_image_gallery', JSON.stringify(updatedGallery));
    } catch (err) {
      alert('Neural Handshake Failed. Retrying uplink...');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 bg-slate-950 border-r border-white/5 p-6 flex flex-col gap-8 shrink-0">
          <div>
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4 opacity-40">Visual Matrix</h3>
              <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Concept Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A cybernetic raven soaring over a digital forest..."
                        className="w-full h-32 bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50 resize-none text-white font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Dimension Matrix</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['1:1', '16:9', '9:16'] as const).map(ratio => (
                            <button
                                key={ratio}
                                onClick={() => setAspectRatio(ratio)}
                                className={`py-3 rounded-xl text-[10px] font-black tracking-widest border transition-all ${
                                aspectRatio === ratio 
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                                    : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-200'
                                }`}
                            >
                                {ratio}
                            </button>
                        ))}
                    </div>
                  </div>
              </div>
          </div>

          <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="mt-auto w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px]"
          >
              {isGenerating ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Synthesizing...</span>
                </>
              ) : (
                <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>Visualize</span>
                </>
              )}
          </button>
      </div>

      {/* Gallery Canvas */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-black">
          {gallery.length === 0 ? (
            <div className="h-full border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-slate-700 gap-6 opacity-40">
                <div className="w-20 h-20 rounded-full border-2 border-slate-800 flex items-center justify-center">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className="font-black text-xs uppercase tracking-[0.4em]">Imagination Buffer Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
                <AnimatePresence>
                    {gallery.map((asset) => (
                        /* Fix: Use MotionDiv */
                        <MotionDiv 
                            key={asset.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            layout
                            className="bg-slate-900 rounded-[32px] overflow-hidden border border-white/5 shadow-2xl group hover:border-indigo-500/30 transition-all"
                        >
                            <div className="relative aspect-square bg-slate-950 overflow-hidden">
                                <img src={asset.url} alt={asset.prompt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                                    <p className="text-white text-xs font-medium line-clamp-2 leading-relaxed opacity-80">{asset.prompt}</p>
                                </div>
                                <button 
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center active:scale-90"
                                    onClick={() => {
                                        const next = gallery.filter(g => g.id !== asset.id);
                                        setGallery(next);
                                        localStorage.setItem('lumina_image_gallery', JSON.stringify(next));
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                </button>
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

export default ImageGenerator;
