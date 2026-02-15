import React from 'react';

interface RRButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    brand?: 'scotia' | 'td' | 'system';
    className?: string;
    disabled?: boolean;
    loading?: boolean;
}

const RRButton: React.FC<RRButtonProps> = ({ 
    onClick, children, variant = 'primary', brand = 'system', className = '', disabled, loading 
}) => {
    const brandColors = {
        scotia: {
            primary: 'bg-[#ED0711] text-white shadow-red-500/20',
            outline: 'border-[#ED0711] text-[#ED0711] border',
            secondary: 'bg-zinc-900 text-white'
        },
        td: {
            primary: 'bg-[#008A00] text-white shadow-green-500/20',
            outline: 'border-[#008A00] text-[#008A00] border',
            secondary: 'bg-white text-gray-800'
        },
        system: {
            primary: 'bg-indigo-600 text-white shadow-indigo-500/20',
            outline: 'border-white/20 text-white border',
            secondary: 'bg-zinc-800 text-white'
        }
    };

    const baseStyles = 'w-full py-4 rounded-[18px] font-black text-[14px] uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2';
    const variantStyles = brandColors[brand][variant as keyof typeof brandColors['system']] || brandColors[brand].primary;

    return (
        <button 
            onClick={onClick} 
            disabled={disabled || loading} 
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : children}
        </button>
    );
};

export default RRButton;