
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BankApp } from '../types';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    apps: BankApp[];
    onOpenApp: (id: string) => void;
}

// Fix: Use casted any for motion component to bypass intrinsic property errors
const MotionDiv = motion.div as any;

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, apps, onOpenApp }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
    }, [isOpen]);

    const filtered = apps.filter(a => 
        a.name.toLowerCase().includes(query.toLowerCase()) || 
        a.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);

    const neuralSuggestions = query.length > 2 ? [
        { label: `Audit ${query} logs`, action: 'audit' },
        { label: `Inject ${query} module`, action: 'inject' },
        { label: `Sync ${query} neural link`, action: 'sync' }
    ] : [];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {/* Fix: Use MotionDiv */}
            <MotionDiv 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-2xl p-6 pt-24"
                onClick={onClose}
            >
                {/* Fix: Use MotionDiv */}
                <MotionDiv 
                    initial={{ y: 20, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    className="max-w-2xl mx-auto w-full"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Neural Command / Search..."
                            className="w-full bg-zinc-900/90 border border-white/10 rounded-[32px] px-8 py-6 text-xl text-white outline-none focus:border-indigo-500/50 shadow-2xl relative z-10 font-medium"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        {query.length > 0 && (
                            <div className="animate-in slide-up">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 px-4">Research Assets</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {filtered.map(app => (
                                        <button 
                                            key={app.id} 
                                            onClick={() => { onOpenApp(app.id); onClose(); }}
                                            className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-all text-left"
                                        >
                                            <img src={app.icon} className="w-10 h-10 rounded-xl object-cover" alt="" />
                                            <div>
                                                <p className="text-white font-bold text-sm">{app.name}</p>
                                                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-tight">{app.category}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {neuralSuggestions.length > 0 && (
                            <div className="animate-in slide-up delay-100">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 px-4 mt-8">Neural Directives</p>
                                <div className="space-y-2">
                                    {neuralSuggestions.map((s, i) => (
                                        <button 
                                            key={i} 
                                            className="w-full bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl flex items-center justify-between group hover:bg-indigo-500/10 transition-all"
                                        >
                                            <span className="text-indigo-300 font-bold text-sm italic">"{s.label}"</span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-indigo-500 group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </MotionDiv>
            </MotionDiv>
        </AnimatePresence>
    );
};

export default SearchOverlay;
