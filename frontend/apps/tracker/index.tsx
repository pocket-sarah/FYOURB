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
    Terminal,
    Radio,
    Wifi,
    Cpu,
    Smartphone,
    Activity,
    ShieldAlert
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
    infrastructure?: {
        relay_dist: string;
        sim_id: string;
        signal: string;
        handshake_integrity: string;
    };
}

const MotionDiv = motion.div as any;

const CellTrackerApp: React.FC<{ app: BankApp; onClose: () => void; onNotify: any }> = ({ app, onClose, onNotify }) => {
    const [activeTab, setActiveTab] = useState<'radar' | 'lookup' | 'history'>('lookup');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [targets, setTargets] = useState<TrackingTarget[]>(() => {
        const saved = localStorage.getItem('stalker_targets_v101');
        return saved ? JSON.parse(saved) : [];
    });
    
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const OPENCAGE_KEY = "3966db6475d54a408cf5f65e839b5e42";

    useEffect(() => {
        localStorage.setItem('stalker_targets_v101', JSON.stringify(targets));
    }, [targets]);

    const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') => {
        const color = type === 'error' ? 'text-red-500' : 
                     type === 'success' ? 'text-green-400 font-bold' : 
                     type === 'warn' ? 'text-yellow-400' : 'text-[#ff003c]/60';
        setLogs(prev => [`<span class="${color}">[${new Date().toLocaleTimeString([], {hour12:false})}] ${msg}</span>`, ...prev].slice(0, 80));
    };

    const trackNumber = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!phoneNumber || loading) return;

        setLoading(true);
        setLogs([]);
        addLog(`[UPLINK] INITIATING SS7_INTERCEPT_V99...`, 'info');
        addLog(`[NODE] TARGET_CID: ${phoneNumber}`, 'info');

        try {
            await new Promise(r => setTimeout(r, 800));
            addLog(`[TRACE] Pinging regional HLR (Home Location Register)...`, 'info');
            await new Promise(r => setTimeout(r, 1200));
            addLog(`[INFRA] Bypassing SS7 Signaling Gateway...`, 'warn');
            
            let parsedNumber;
            try {
                parsedNumber = parsePhoneNumber(phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`);
                if (!parsedNumber.isValid()) {
                    parsedNumber = parsePhoneNumber(phoneNumber, 'CA');
                }
            } catch (e) {
                try { parsedNumber = parsePhoneNumber(phoneNumber, 'CA'); } catch {}
            }

            if (!parsedNumber || !parsedNumber.isValid()) {
                throw new Error("Invalid Handshake: Target Node ID format rejected.");
            }

            const regionCode = parsedNumber.country; 
            const formattedNum = parsedNumber.formatInternational();
            const regionNameDisplay = new Intl.DisplayNames(['en'], { type: 'region' });
            const countryName = regionCode ? regionNameDisplay.of(regionCode) : "Canada";

            addLog(`[HANDSHAKE] SIGNAL_LOCKED: ${formattedNum}`, 'success');
            addLog(`[NODE] COUNTRY_ORIGIN: ${countryName}`, 'success');

            addLog(`[GPS] Triangulating Relay Cluster via Satellite Matrix...`, 'info');
            const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(countryName)}&key=${OPENCAGE_KEY}&limit=1`;
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const loc = data.results[0];
                
                const newTarget: TrackingTarget = {
                    number: formattedNum,
                    location: loc.formatted,
                    coords: [loc.geometry.lat, loc.geometry.lng],
                    isp: "Global_LTE_Relay / Node_" + Math.floor(Math.random() * 9999),
                    device: "Neural Handset v" + (Math.random() * 10).toFixed(1),
                    timestamp: Date.now(),
                    status: 'ACTIVE',
                    infrastructure: {
                        relay_dist: (Math.random() * 5 + 0.5).toFixed(2) + " km",
                        sim_id: "ICCID_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
                        signal: `-${Math.floor(Math.random() * 30 + 60)} dBm`,
                        handshake_integrity: "98.4%"
                    }
                };

                setTimeout(() => {
                    setTargets(prev => [newTarget, ...prev]);
                    addLog(`[OK] COORDINATES_COMMITTED: ${loc.geometry.lat}, ${loc.geometry.lng}`, 'success');
                    addLog(`[OK] DOSSIER_SNAPSHOT_SAVED.`, 'success');
                    onNotify("Target Locked", `${formattedNum} triangulated in ${countryName}.`, app.icon);
                    setActiveTab('radar');
                    setLoading(false);
                }, 1500);
            } else {
                throw new Error("Handshake timeout: Satellite link severed.");
            }
        } catch (err: any) {
            addLog(`[FATAL] TRACE_ABORTED: ${err.message}`, 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'radar' && mapContainerRef.current) {
            if (mapInstanceRef.current) mapInstanceRef.current.remove();

            const lastTarget = targets[0];
            const center: L.LatLngExpression = lastTarget ? [lastTarget.coords[0], lastTarget.coords[1]] : [45.4215, -75.6972]; // Ottawa fallback

            const map = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView(center, 8);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

            targets.forEach(t => {
                const pulseIcon = L.divIcon({
                    className: 'css-icon',
                    html: `<div class="relative flex items-center justify-center">
                              <div class="absolute w-24 h-24 bg-red-500/10 rounded-full animate-ping"></div>
                              <div class="absolute w-12 h-12 bg-red-500/20 rounded-full border border-red-500/30"></div>
                              <div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-[0_0_20px_#ff003c]"></div>
                           </div>`,
                    iconSize: [0, 0]
                });
                L.marker([t.coords[0], t.coords[1]], { icon: pulseIcon }).addTo(map)
                    .bindPopup(`<div style="color:#ff003c; font-family:monospace; background:#000; padding:12px; border-radius:12px; border:1px solid #ff003c50;">
                        <b style="font-size:14px;">${t.number}</b><br>
                        <span style="font-size:10px; opacity:0.6;">${t.location}</span><br>
                        <div style="margin-top:8px; border-top:1px solid #333; padding-top:4px;">
                            <span style="font-size:9px; font-weight:900;">SIGNAL: ${t.infrastructure?.signal}</span>
                        </div>
                    </div>`);
            });
            mapInstanceRef.current = map;
        }
    }, [activeTab, targets]);

    return (
        <AppLayout brandColor="#ff003c" onClose={onClose} title="SIGNAL_STALKER Ω">
            <div className="flex flex-col h-full bg-[#050505] text-[#ff003c] font-mono relative overflow-hidden">
                {/* HUD Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none z-[50] opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#ff003c 1px, transparent 1px), linear-gradient(90deg, #ff003c 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === 'lookup' && (
                            <MotionDiv key="lookup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col p-6 gap-6 relative z-10">
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_60px_rgba(255,0,60,0.2)]">
                                        {loading ? <SpinnerIcon className="w-12 h-12 text-[#ff003c]" /> : <Radar size={48} className="animate-pulse" />}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-[0.4em] text-white glitch-text">Interceptor</h2>
                                        <p className="text-[10px] text-red-500/60 uppercase tracking-widest font-bold">Node Handshake Protocol Active</p>
                                    </div>
                                </div>

                                <form onSubmit={trackNumber} className="space-y-6 max-w-sm mx-auto w-full">
                                    <div className="bg-black/80 border border-white/10 rounded-3xl flex items-center px-6 py-5 focus-within:border-red-500 shadow-2xl transition-all">
                                        <Hash size={20} className="text-red-500/40 mr-4" />
                                        <input 
                                            type="text" 
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            placeholder="+1 XXX XXX XXXX"
                                            className="bg-transparent border-none outline-none text-xl text-white font-bold tracking-widest w-full placeholder:text-zinc-900"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={loading || !phoneNumber.trim()}
                                        className="w-full py-5 bg-[#ff003c] text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-[0_0_40px_rgba(255,0,60,0.4)] active:scale-[0.98] transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                                    >
                                        {loading ? 'Bypassing Node Gateways...' : 'Initiate Triangulation'}
                                    </button>
                                </form>

                                <div className="mt-auto bg-black/80 border border-[#ff003c]/20 rounded-[40px] p-6 h-56 overflow-y-auto no-scrollbar space-y-1 shadow-inner relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                                        <Activity size={100} />
                                     </div>
                                    <p className="text-zinc-600 font-bold border-b border-white/5 pb-2 mb-2 uppercase tracking-widest flex items-center gap-2">
                                        <Terminal size={12} /> System_Log_Buffer
                                    </p>
                                    {logs.length === 0 ? <p className="opacity-10 text-[10px] uppercase tracking-widest text-center mt-10">Awaiting target signature...</p> : logs.map((log, i) => (
                                        <div key={i} className="text-[10px] font-mono leading-relaxed" dangerouslySetInnerHTML={{__html: log}} />
                                    ))}
                                </div>
                            </MotionDiv>
                        )}

                        {activeTab === 'radar' && (
                            <MotionDiv key="radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full relative bg-black">
                                <div ref={mapContainerRef} className="w-full h-full z-0" />
                                
                                <div className="absolute top-6 left-6 right-6 pointer-events-none flex justify-between">
                                    <div className="bg-black/90 backdrop-blur-xl border border-[#ff003c]/30 p-4 rounded-2xl flex flex-col gap-1 shadow-2xl">
                                        <span className="text-[8px] font-black uppercase opacity-40">UPLINK_STATUS</span>
                                        <span className="text-xs font-bold text-green-500 animate-pulse">SYNCHRONIZED_Ω</span>
                                    </div>
                                    <div className="bg-black/90 backdrop-blur-xl border border-[#ff003c]/30 p-4 rounded-2xl flex flex-col items-end gap-1 shadow-2xl">
                                        <span className="text-[8px] font-black uppercase opacity-40">ACTIVE_PINGS</span>
                                        <span className="text-xs font-bold text-white">{targets.length} Target Nodes</span>
                                    </div>
                                </div>

                                {targets[0] && (
                                     <div className="absolute bottom-28 left-6 right-6 pointer-events-none">
                                        <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-black/90 backdrop-blur-md border border-[#ff003c]/30 p-6 rounded-[32px] shadow-2xl pointer-events-auto">
                                            <div className="flex justify-between items-center mb-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#ff003c]/10 flex items-center justify-center text-[#ff003c]">
                                                        <Smartphone size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-black text-white">{targets[0].number}</span>
                                                        <p className="text-[9px] text-[#ff003c] font-black uppercase tracking-widest mt-0.5">Primary Target</p>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-bold text-green-500 uppercase px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5">Trace_Active</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                                                    <p className="text-[7px] font-black text-zinc-500 uppercase mb-1">Signal</p>
                                                    <p className="text-[11px] font-bold text-emerald-400">{targets[0].infrastructure?.signal}</p>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                                                    <p className="text-[7px] font-black text-zinc-500 uppercase mb-1">Relay</p>
                                                    <p className="text-[11px] font-bold text-indigo-400">{targets[0].infrastructure?.relay_dist}</p>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                                                    <p className="text-[7px] font-black text-zinc-500 uppercase mb-1">Integrity</p>
                                                    <p className="text-[11px] font-bold text-white">{targets[0].infrastructure?.handshake_integrity}</p>
                                                </div>
                                            </div>
                                        </MotionDiv>
                                     </div>
                                )}
                            </MotionDiv>
                        )}

                        {activeTab === 'history' && (
                            <MotionDiv key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="h-full flex flex-col p-6">
                                <div className="flex justify-between items-center mb-8 px-2 pt-2">
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Dossier Vault</h3>
                                    <button onClick={() => setTargets([])} className="p-3 text-red-500/40 hover:text-red-500 transition-colors bg-white/5 rounded-2xl"><Trash2 size={20} /></button>
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-24">
                                    {targets.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center opacity-10 gap-8 grayscale">
                                            <History size={100} strokeWidth={1} />
                                            <p className="text-[12px] font-black uppercase tracking-[0.6em]">Neural Buffer Purged</p>
                                        </div>
                                    ) : (
                                        targets.map((target, idx) => (
                                            <div key={idx} className="bg-white/5 border border-white/10 rounded-[40px] p-7 space-y-6 relative overflow-hidden group hover:border-red-500/40 transition-all shadow-2xl">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none group-hover:bg-red-500/10 transition-colors"></div>
                                                <div className="flex justify-between items-start relative z-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-[22px] bg-black border border-white/10 flex items-center justify-center text-[#ff003c] shadow-inner">
                                                            <Smartphone size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-2xl font-black text-white tracking-tighter mb-1">{target.number}</h4>
                                                            <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{target.location.split(',')[0]}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[9px] font-black px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20 uppercase tracking-widest">Locked_Ω</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-8 pt-7 border-t border-white/5 relative z-10">
                                                    <div>
                                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-2">Network Infrastructure</span>
                                                        <p className="text-[13px] font-bold text-zinc-300 flex items-center gap-2"><Wifi size={14} className="text-[#ff003c]" /> {target.isp}</p>
                                                        <p className="text-[11px] text-zinc-500 mt-1">SIM_ID: {target.infrastructure?.sim_id}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-2">Hardware Spec</span>
                                                        <p className="text-[13px] font-bold text-zinc-300 flex items-center gap-2"><Cpu size={14} className="text-[#ff003c]" /> {target.device}</p>
                                                        <p className="text-[11px] text-zinc-500 mt-1">Status: Stable Uplink</p>
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

                <nav className="h-24 bg-black/95 backdrop-blur-3xl border-t border-[#ff003c]/20 flex items-center justify-around pb-8 px-6 shrink-0 z-[100] shadow-[0_-10px_60px_rgba(0,0,0,1)]">
                    <TabButton active={activeTab === 'lookup'} onClick={() => setActiveTab('lookup')} icon={<Search size={22} />} label="Intercept" />
                    <TabButton active={activeTab === 'radar'} onClick={() => setActiveTab('radar')} icon={<Radar size={22} />} label="Tactical" />
                    <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={22} />} label="History" />
                </nav>
            </div>
        </AppLayout>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-2 transition-all duration-300 relative ${active ? 'text-[#ff003c] scale-110 drop-shadow-[0_0_15px_rgba(255,0,60,0.5)]' : 'text-zinc-800 hover:text-[#ff003c]/60'}`}
    >
        {icon}
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        {active && <motion.div layoutId="stalker-tab" className="absolute -bottom-4 w-1.5 h-1.5 bg-[#ff003c] rounded-full shadow-[0_0_10px_#ff003c]" />}
    </button>
);

export default CellTrackerApp;