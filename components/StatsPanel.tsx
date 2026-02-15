import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricPoint } from '../types';
import { Cpu, Wifi } from 'lucide-react';

interface StatsPanelProps {
  data: MetricPoint[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ data }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        <div className="flex items-center px-4 py-2 bg-slate-800/80 border-b border-slate-700">
            <Cpu className="w-4 h-4 text-purple-500 mr-2" />
            <span className="text-xs font-mono text-cyan-400 tracking-wider">SYSTEM_METRICS // REALTIME</span>
        </div>

        <div className="flex-1 flex flex-col p-4 gap-4">
            
            {/* Traffic Chart */}
            <div className="flex-1 min-h-[150px]">
                <div className="text-[10px] font-mono text-slate-400 mb-2 flex items-center">
                    <Wifi className="w-3 h-3 mr-1" /> NETWORK_TRAFFIC_IO
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '12px' }} 
                            itemStyle={{ color: '#e2e8f0' }}
                        />
                        <Area type="monotone" dataKey="inbound" stroke="#06b6d4" fillOpacity={1} fill="url(#colorInbound)" />
                        <Area type="monotone" dataKey="outbound" stroke="#f43f5e" fillOpacity={1} fill="url(#colorOutbound)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* CPU Chart */}
            <div className="flex-1 min-h-[150px] border-t border-slate-800 pt-4">
                 <div className="text-[10px] font-mono text-slate-400 mb-2 flex items-center">
                    <Cpu className="w-3 h-3 mr-1" /> CORE_PROCESSING_LOAD
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '12px' }} 
                            itemStyle={{ color: '#e2e8f0' }}
                        />
                        <Area type="monotone" dataKey="cpu" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCpu)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default StatsPanel;
