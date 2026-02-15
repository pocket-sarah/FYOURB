import React from 'react';

interface WallpaperSectionProps {
    currentUrl: string;
    onSelect: (url: string) => void;
    isDark: boolean;
}

export const WallpaperSection: React.FC<WallpaperSectionProps> = ({ currentUrl, onSelect, isDark }) => {
    const options = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2671&auto=format&fit=crop'
    ];
    return (
        <div className="space-y-8 animate-in slide-up">
            <div className="grid grid-cols-2 gap-4">
                {options.map((url, i) => (
                    <button 
                        key={i} 
                        onClick={() => onSelect(url)}
                        className={`aspect-[9/16] rounded-[24px] overflow-hidden border-2 transition-all ${currentUrl === url ? 'border-blue-500 scale-[1.02] shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                        <img src={url} className="w-full h-full object-cover" alt="" />
                    </button>
                ))}
            </div>
        </div>
    );
};