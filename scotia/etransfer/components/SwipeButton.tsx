
import React, { useState, useRef } from 'react';

interface SwipeButtonProps {
    onComplete: () => void;
    disabled?: boolean;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({ onComplete, disabled }) => {
    const [dragX, setDragX] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = (e: any) => {
        if (!isDragging || !containerRef.current || disabled) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left - 10, rect.width - 64)); // Adjusted padding logic
        setDragX(x);
        if (x > rect.width - 80) { 
            setIsDragging(false); 
            setDragX(0);
            onComplete(); 
        }
    };

    return (
        <div 
            className={`relative h-[68px] bg-[#1c1c1e] rounded-full flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl select-none ${disabled ? 'opacity-50 grayscale' : ''}`}
            ref={containerRef}
            onTouchMove={handleMove} onMouseMove={handleMove}
            onTouchEnd={() => { setIsDragging(false); setDragX(0); }}
            onMouseLeave={() => { setIsDragging(false); setDragX(0); }}
        >
            <span className="text-zinc-600 font-black text-[15px] uppercase tracking-widest pointer-events-none transition-opacity duration-300" style={{ opacity: isDragging ? 0.3 : 1 }}>Slide to send</span>
            
            {/* Track Highlight */}
            <div 
                className="absolute left-2 top-2 bottom-2 bg-[#ED0711]/20 rounded-full pointer-events-none transition-all duration-75"
                style={{ width: Math.max(52, dragX + 52) }}
            />

            <div 
                className="absolute left-2 top-2 bottom-2 w-[52px] bg-[#ED0711] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-[0_0_15px_rgba(237,7,17,0.4)] border border-white/10"
                style={{ transform: `translateX(${dragX}px)`, transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
                onTouchStart={() => setIsDragging(true)} onMouseDown={() => setIsDragging(true)}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="drop-shadow-sm"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
        </div>
    );
};

export default SwipeButton;
