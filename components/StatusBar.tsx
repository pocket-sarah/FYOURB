
import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  currentView: string;
  os: 'ios' | 'android';
}

const StatusBar: React.FC<StatusBarProps> = ({ currentView, os }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="h-8 px-5 flex items-center justify-between text-white font-medium text-sm absolute top-0 left-0 right-0 z-[3000] mix-blend-difference">
        {/* Time - Top Left */}
        <div className="font-bold tracking-wide text-[13px]">{timeStr}</div>

        {/* System Icons - Top Right */}
        <div className="flex items-center gap-2.5 opacity-90">
            {/* Alarm / Silent icons often go here */}
            
            {/* Signal */}
            <div className="flex items-end gap-[2px] h-3">
               <div className="w-[3px] h-[40%] bg-white rounded-[1px]"></div>
               <div className="w-[3px] h-[60%] bg-white rounded-[1px]"></div>
               <div className="w-[3px] h-[80%] bg-white rounded-[1px]"></div>
               <div className="w-[3px] h-[100%] bg-white rounded-[1px]"></div>
            </div>

            {/* WiFi */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0001 3C7.29227 3 3.03662 4.93557 0 8.09375L12.0001 22.0937L24.0002 8.09375C20.9636 4.93557 16.7079 3 12.0001 3Z"/></svg>

            {/* Battery - Horizontal Pill */}
            <div className="flex items-center gap-1">
                <div className="w-[22px] h-[11px] border border-white/60 rounded-[3px] relative p-[1px]">
                    <div className="h-full bg-white w-[92%] rounded-[1px]"></div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default StatusBar;
