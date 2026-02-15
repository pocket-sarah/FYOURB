import React, { useEffect, useState } from 'react';

interface NotificationProps {
  title: string;
  message: string;
  icon: string;
  onClose: () => void;
  onClick?: () => void;
}

const SystemNotification: React.FC<NotificationProps> = ({ title, message, icon, onClose, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleInteraction = () => {
    if (onClick) onClick();
    setIsVisible(false);
    setTimeout(onClose, 500);
  };

  return (
    <div 
      className={`fixed top-4 left-4 right-4 z-[200] transition-all duration-500 transform cursor-pointer ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      }`}
      onClick={handleInteraction}
    >
      <div className="bg-white/80 backdrop-blur-2xl rounded-[24px] p-4 shadow-2xl border border-white/20 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-white shrink-0">
          <img src={icon} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[13px] font-bold text-black truncate uppercase tracking-tight">{title}</span>
            <span className="text-[10px] font-medium text-black/40">now</span>
          </div>
          <p className="text-[13px] text-black/80 leading-tight line-clamp-2">{message}</p>
        </div>
        <div className="w-1 h-8 bg-black/5 rounded-full self-center" />
      </div>
    </div>
  );
};

export default SystemNotification;