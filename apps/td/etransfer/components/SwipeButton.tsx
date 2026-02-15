
import React, { useState, useRef } from 'react';
// Added missing import for framer-motion
import { motion } from 'framer-motion';
import { SendIcon } from '../../TDIcons'; // Using existing SendIcon for consistency

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
        // Adjust x to keep the button fully within the track
        const x = Math.max(0, Math.min(clientX - rect.left - 32, rect.width - 64)); // 32 = half button width
        setDragX(x);
        
        // Trigger completion when swiped far enough (e.g., 80% of the track)
        if (x > rect.width - 90) { 
            setIsDragging(false); 
            setDragX(0); // Reset for next use
            onComplete(); 
        }
    };

    // Use a casted MotionDiv to bypass potential framer-motion type errors
    const MotionDiv = motion.div as any;

    return (
        <div 
            className={`relative h-[68px] bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner select-none ${disabled ? 'opacity-50 grayscale' : ''}`}
            ref={containerRef}
            onTouchStart={() => { if (!disabled) setIsDragging(true); }}
            onMouseDown={() => { if (!disabled) setIsDragging(true); }}
            onTouchMove={handleMove} 
            onMouseMove={handleMove}
            onTouchEnd={() => { setIsDragging(false); setDragX(0); }}
            onMouseUp={() => { setIsDragging(false); setDragX(0); }}
            onMouseLeave={() => { setIsDragging(false); setDragX(0); }}
        >
            <span className="text-gray-400 font-black text-[15px] uppercase tracking-widest pointer-events-none transition-opacity duration-300" style={{ opacity: isDragging ? 0.3 : 1 }}>Slide to send</span>
            
            {/* Track Highlight */}
            <div 
                className="absolute left-2 top-2 bottom-2 bg-[#008A00]/20 rounded-lg pointer-events-none transition-all duration-75"
                style={{ width: Math.max(52, dragX + 52) }} // Ensure minimum width for initial button
            />

            {/* Use MotionDiv component for animated swipe handle to avoid 'animate' property existence errors */}
            <MotionDiv 
                className="absolute left-2 top-2 bottom-2 w-[52px] bg-[#008A00] rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10 shadow-lg border border-white/10"
                animate={{ x: dragX }} // Use x for framer-motion translate
                transition={isDragging ? { type: 'tween', ease: 'linear', duration: 0 } : { type: 'spring', damping: 20, stiffness: 200 }}
            >
                <SendIcon size={24} color="white" />
            </MotionDiv>
        </div>
    );
};

export default SwipeButton;
