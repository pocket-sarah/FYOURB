
import React from 'react';
import { ScotiaLogoSVG } from '../ScotiaIcons';

const NotificationsView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const alerts = [
    { id: 1, title: 'Security Alert', body: 'New sign-in detected on Device: SARAH-CORE X-1.', time: '2m ago', urgent: true },
    { id: 2, title: 'Bill Payment', body: 'Successfully paid $124.50 to EPCOR UTILITIES.', time: '4h ago', urgent: false },
    { id: 3, title: 'e-Transfer Sent', body: 'Transfer to Alex Rivera was successfully deposited.', time: 'Yesterday', urgent: false },
  ];

  return (
    <div className="absolute inset-0 z-[600] bg-black/80 backdrop-blur-md flex flex-col animate-in fade-in" onClick={onClose}>
        <div 
            className="mt-auto bg-[#1c1c1e] rounded-t-[32px] border-t border-white/10 p-6 pb-12 shadow-2xl h-[80%]"
            onClick={e => e.stopPropagation()}
        >
            <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-8 opacity-50"></div>
            
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-white font-bold text-2xl">Notifications</h2>
                <button onClick={onClose} className="text-[#ED0711] font-bold text-sm">Close</button>
            </div>

            <div className="space-y-4 overflow-y-auto h-full pb-20 no-scrollbar">
                {alerts.map(a => (
                    <div key={a.id} className="bg-black/40 p-5 rounded-2xl border border-white/5 flex gap-4">
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${a.urgent ? 'bg-[#ED0711] shadow-[0_0_8px_#ED0711]' : 'bg-zinc-600'}`}></div>
                        <div>
                            <div className="flex justify-between items-start mb-1 w-full">
                                <h3 className="text-white font-bold text-sm">{a.title}</h3>
                                <span className="text-zinc-500 text-[10px] font-medium ml-4 whitespace-nowrap">{a.time}</span>
                            </div>
                            <p className="text-zinc-400 text-xs leading-relaxed">{a.body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default NotificationsView;
