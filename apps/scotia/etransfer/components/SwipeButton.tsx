
import React, { useState, useRef } from 'react';

interface SwipeButtonProps {
    onComplete: () => void;
    disabled?: boolean;
    text?: string; // New prop for custom text
}

const SwipeButton: React.FC<SwipeButtonProps> = ({ onComplete, disabled, text = "Slide to complete" }) => {
    const [dragX, setDragX] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = (e: any) => {
        if (!isDragging || !containerRef.current || disabled) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left - 32, rect.width - 64));
        setDragX(x);
        if (x > rect.width - 90) { 
            setIsDragging(false); 
            setDragX(0);
            onComplete(); 
        }
    };

    return (
        <div 
            className={`relative h-[68px] bg-white rounded-full flex items-center justify-center overflow-hidden border border-zinc-200 shadow-2xl select-none ${disabled ? 'opacity-50 grayscale' : ''}`}
            ref={containerRef}
            onTouchMove={handleMove} onMouseMove={handleMove}
            onTouchEnd={() => { setIsDragging(false); setDragX(0); }}
            onMouseLeave={() => { setIsDragging(false); setDragX(0); }}
        >
            <span className="text-zinc-400 font-black text-[15px] uppercase tracking-widest pointer-events-none">{text}</span>
            <div 
                className="absolute left-2 top-2 bottom-2 w-[52px] bg-[#ED0711] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-lg"
                style={{ transform: `translateX(${dragX}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease-out' }}
                onTouchStart={() => setIsDragging(true)} onMouseDown={() => setIsDragging(true)}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
        </div>
    );
};

export default SwipeButton;