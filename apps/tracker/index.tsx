
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../shared/layouts/AppLayout';
import { BankApp } from '../../types';
import { 
    Radar, 
    Search, 
    History, 
    Crosshair,
    Trash2,
    Hash,
    Map as MapIcon,
    Globe,
    Terminal
} from 'lucide-react';
import { parsePhoneNumber } from 'libphonenumber-js';
import L from 'leaflet';
import { CloseIcon, GlobeIcon, SpinnerIcon } from './components/TrackerIcons';

export interface TrackingTarget {
    number: string;
    location: string;
    coords: [number, number];
    isp: string;
    device: string;
    timestamp: number;
    status: 'ACTIVE' | 'OFFLINE' | 'STALED';
}

const MotionDiv = motion.div as any;

const CellTrackerApp: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [activeTab, setActiveTab] = useState<'radar' | 'lookup' | 'history'>('lookup');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [targets, setTargets] = useState<TrackingTarget[]>(() => {
        const saved = localStorage.getItem('stalker_targets_v1');
        return saved ? JSON.parse(saved) : [];
    });
    
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const OPENCAGE_KEY = "3966db6475d54a408cf5f65e839b5e42";

    useEffect(() => {
        localStorage.setItem('stalker_targets_v1', JSON.stringify(targets));
    }, [targets]);

    const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
        const color = type === 'error' ? 'text-red-500' : type === 'success' ? 'text-green-400' : 'text-zinc-500';
        setLogs(prev => [`<span class="${color} font-mono text-[10px]">[${new Date().toLocaleTimeString([], {hour12:false})}] ${msg}</span>`, ...prev].slice(0, 50));
    };

    const trackNumber = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!phoneNumber || loading) return;

        setLoading(true);
        setLogs([]);
        addLog(`[System] Initializing OSINT Tracker...`, 'info');
        addLog(`[Input] Target: ${phoneNumber}`, 'info');

        try {
            // Step 1: Parsing
            let parsedNumber;
            try {
                parsedNumber = parsePhoneNumber(phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`);
                if (!parsedNumber.isValid()) {
                    if (phoneNumber.startsWith('09')) parsedNumber = parsePhoneNumber(phoneNumber, 'PH');
                    else if (phoneNumber.startsWith('01')) parsedNumber = parsePhoneNumber(phoneNumber, 'EG');
                }
            } catch (e) {
                try { parsedNumber = parsePhoneNumber(phoneNumber, 'EG'); } catch {}
            }

            if (!parsedNumber || !parsedNumber.isValid()) {
                throw new Error("Invalid phone number format.");
            }

            const regionCode = parsedNumber.country; 
            const formattedNum = parsedNumber.formatInternational();
            const regionNameDisplay = new Intl.DisplayNames(['en'], { type: 'region' });
            const countryName = regionCode ? regionNameDisplay.of(regionCode) : "Egypt";

            addLog(`[Success] Number Validated: ${formattedNum}`, 'success');
            addLog(`[Info] Country Detected: ${countryName}`, 'success');

            // Step 2: OpenCage Geocoding
            addLog(`[Query] Triangulating signal via OpenCage API...`, 'info');
            const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(countryName || 'Egypt')}&key=${OPENCAGE_KEY}&limit=1`;
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const loc = data.results[0];
                const lat = loc.geometry.lat;
                const lng = loc.geometry.lng;
                const formattedAddr = loc.formatted;
                
                const newTarget: TrackingTarget = {
                    number: formattedNum,
                    location: formattedAddr,
                    coords: [lat, lng],
                    isp: "Vodafone Egypt / Global Relay",
                    device: "Neural Handset",
                    timestamp: Date.now(),
                    status: 'ACTIVE'
                };

                setTargets(prev => [newTarget, ...prev]);
                addLog(`[Success] Coordinates Locked: ${lat}, ${lng}`, 'success');
                onNotify("Target Acquired", `${formattedNum} triangulated.`, app.icon);
                
                setActiveTab('radar');
                setLoading(false);
            } else {
                throw new Error("Geocoding timeout.");
            }
        } catch (err: any) {
            addLog(`[Error] Trace Failed: ${err.message}`, 'error');
            setLoading(false);
        }
    };

    // Render Map when Radar Tab is active
    useEffect(() => {
        if (activeTab === 'radar' && mapContainerRef.current) {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
            }

            const lastTarget = targets[0];
            const center: L.LatLngExpression = lastTarget ? [lastTarget.coords[0], lastTarget.coords[1]] : [30.0444, 31.2357]; // Cairo default

            const map = L.map(mapContainerRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView(center, 6);
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

            targets.forEach(t => {
                const pulseIcon = L.divIcon({
                    className: 'css-icon',
                    html: `<div class="relative flex items-center justify-center">
                              <div class="absolute w-12 h-12 bg-red-500/20 rounded-full animate-ping"></div>
                              <div class="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-[0_0_10px_#ff003c]"></div>
                           </div>`,
                    iconSize: [0, 0]
                });
                L.marker([t.coords[0], t.coords[1]], { icon: pulseIcon }).addTo(map)
                    .bindPopup(`<div style="color:#000; font-family:monospace;"><b>${t.number}</b><br>${t.location}</div>`);
            });

            mapInstanceRef.current = map;
        }
    }, [activeTab, targets]);

    return (
        <AppLayout brandColor="#ff003c" onClose={onClose} title="SIGNAL STALKER v100">
            <div className="flex flex-col h-full bg-[#020617] text-[#ff003c] font-mono overflow-hidden">
                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'lookup' && (
                            <MotionDiv key="lookup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col p-6 gap-6">
                                <div className="text-center py-10 space-y-4">
                                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_50px_rgba(255,0,60,0.15)] relative">
                                        {loading ? <SpinnerIcon className="w-12 h-12" /> : <Crosshair size={48} className="animate-pulse" />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Signal Hook</h2>
                                        <p className="text-[10px] text-red-500/60 uppercase tracking-widest font-bold">Infiltrating regional SS7 clusters</p>
                                    </div>
                                </div>

                                <form onSubmit={trackNumber} className="space-y-6 max-w-sm mx-auto w-full">
                                    <div className="bg-black/60 border border-white/10 rounded-3xl flex items-center px-6 py-5 focus-within:border-red-500/50 transition-all">
                                        <Hash size={20} className="text-red-500/40 mr-4" />
                                        <input 
                                            type="text" 
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            placeholder="+20 XXX XXX XXXX"
                                            className="bg-transparent border-none outline-none text-xl text-white font-bold tracking-widest w-full placeholder:text-zinc-800"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={loading || !phoneNumber.trim()}
                                        className="w-full py-5 bg-red-600 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-[0.98] transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                                    >
                                        {loading ? 'Bypassing Firewall...' : 'Initiate Triangulation'}
                                    </button>
                                </form>

                                <div className="mt-auto bg-black/40 border border-white/5 rounded-3xl p-5 font-mono text-[10px] h-32 overflow-y-auto no-scrollbar space-y-1">
                                    <p className="text-zinc-600 font-bold border-b border-white/5 pb-2 mb-2 uppercase tracking-widest flex items-center gap-2">
                                        {/* Fixed: Terminal icon added to imports to resolve missing name error. */}
                                        <Terminal size={12} /> System_Log_Buffer
                                    </p>
                                    {logs.length === 0 ? <p className="opacity-20">Awaiting target parameters...</p> : logs.map((log, i) => (
                                        <div key={i} dangerouslySetInnerHTML={{__html: log}} />
                                    ))}
                                </div>
                            </MotionDiv>
                        )}

                        {activeTab === 'radar' && (
                            <MotionDiv key="radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full relative bg-black">
                                <div ref={mapContainerRef} className="w-full h-full z-0" />
                                
                                {/* Tactical HUD Overlay */}
                                <div className="absolute top-6 left-6 right-6 pointer-events-none flex justify-between">
                                    <div className="bg-black/90 backdrop-blur-xl border border-[#ff003c]/30 p-4 rounded-2xl flex flex-col gap-1 shadow-2xl">
                                        <span className="text-[8px] font-black uppercase opacity-40">UPLINK_ENCRYPTION</span>
                                        <span className="text-xs font-bold text-green-500 animate-pulse">AES_256_ACTIVE</span>
                                    </div>
                                    <div className="bg-black/90 backdrop-blur-xl border border-[#ff003c]/30 p-4 rounded-2xl flex flex-col items-end gap-1 shadow-2xl">
                                        <span className="text-[8px] font-black uppercase opacity-40">NODES_DISCOVERED</span>
                                        <span className="text-xs font-bold text-white">{targets.length} Target(s)</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-28 right-6">
                                     <button 
                                        onClick={() => {
                                            if (mapInstanceRef.current && targets[0]) {
                                                mapInstanceRef.current.flyTo([targets[0].coords[0], targets[0].coords[1]], 14);
                                            }
                                        }}
                                        className="w-12 h-12 bg-[#ff003c] rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 pointer-events-auto"
                                     >
                                        <Crosshair size={24} />
                                     </button>
                                </div>
                            </MotionDiv>
                        )}

                        {activeTab === 'history' && (
                            <MotionDiv key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="h-full flex flex-col p-6">
                                <div className="flex justify-between items-center mb-8 px-2">
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Capture Registry</h3>
                                    <button onClick={() => setTargets([])} className="p-3 text-red-500/40 hover:text-red-500 transition-colors bg-white/5 rounded-2xl"><Trash2 size={20} /></button>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
                                    {targets.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6 grayscale">
                                            <History size={80} />
                                            <p className="text-[11px] font-black uppercase tracking-[0.6em]">Neural Buffer Purged</p>
                                        </div>
                                    ) : (
                                        targets.map((target, idx) => (
                                            <div key={idx} className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-6 relative overflow-hidden group hover:border-red-500/40 transition-all shadow-2xl">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none"></div>
                                                <div className="flex justify-between items-start relative z-10">
                                                    <div>
                                                        <h4 className="text-xl font-black text-white tracking-tighter mb-1">{target.number}</h4>
                                                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{target.location.split(',')[0]}</p>
                                                    </div>
                                                    <span className="text-[9px] font-black px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20 uppercase">Locked</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5 relative z-10">
                                                    <div>
                                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Infrastructure</span>
                                                        <p className="text-[12px] font-bold text-zinc-400">{target.isp}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Target Device</span>
                                                        <p className="text-[12px] font-bold text-zinc-400">{target.device}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tactical Bottom Navigation */}
                <nav className="h-24 bg-black/95 backdrop-blur-3xl border-t border-white/10 flex items-center justify-around pb-8 px-6 shrink-0 z-[100] shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
                    <button 
                        onClick={() => setActiveTab('lookup')}
                        className={`flex flex-col items-center gap-2 transition-all duration-500 ${activeTab === 'lookup' ? 'text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(255,0,60,0.4)]' : 'text-zinc-700 hover:text-red-500/40'}`}
                    >
                        <Search size={22} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Intercept</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('radar')}
                        className={`flex flex-col items-center gap-2 transition-all duration-500 ${activeTab === 'radar' ? 'text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(255,0,60,0.4)]' : 'text-zinc-700 hover:text-red-500/40'}`}
                    >
                        <GlobeIcon className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Tactical</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`flex flex-col items-center gap-2 transition-all duration-500 ${activeTab === 'history' ? 'text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(255,0,60,0.4)]' : 'text-zinc-700 hover:text-red-500/40'}`}
                    >
                        <History size={22} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Registry</span>
                    </button>
                </nav>
            </div>
        </AppLayout>
    );
};

export default CellTrackerApp;
