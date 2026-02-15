
import React, { useState, useEffect, useRef } from 'react';

const AuditTerminal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [lines, setLines] = useState<string[]>([
        "--- DARKFORGE-X NEURAL SHELL v4.2 ---",
        "CONNECTING TO GATEWAY NODE...",
        "AUTHENTICATED: USER_ROOT",
        "READY FOR SEQUENCING.",
        "Type 'help' for available commands.",
        ""
    ]);
    const [input, setInput] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [lines]);

    const printLine = (text: string, delay = 0) => {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                setLines(prev => [...prev, text]);
                resolve();
            }, delay);
        });
    };

    const simulateSSH = async (target: string) => {
        setIsLocked(true);
        await printLine(`[SSH] Initiating handshake with ${target}...`, 200);
        await printLine(`[SSH] Exchange: CURVE25519_SHA256`, 600);
        await printLine(`[SSH] Auth: Public Key (simulated)`, 1000);
        await printLine(`[SSH] Verifying...`, 1500);
        await printLine(`[SSH] ACCESS GRANTED. Welcome to ${target}.`, 2200);
        setIsLocked(false);
    };

    const simulateWorm = async () => {
        setIsLocked(true);
        await printLine(`[WORM] Initializing replication protocol...`, 200);
        await printLine(`[WORM] Target list acquired: 14 nodes.`, 800);
        await printLine(`[WORM] Injecting payload [polymorphic_v4]...`, 1500);
        
        const targets = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA'];
        for (const t of targets) {
             await printLine(`[WORM] > Infecting Node ${t}... SUCCESS`, 300);
        }
        
        await printLine(`[WORM] Propagation Complete. Grid compromised (SIMULATION).`, 1000);
        setIsLocked(false);
    };

    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked) return;

        const cmd = input.trim();
        const args = cmd.split(' ');
        const primary = args[0].toLowerCase();

        if (!cmd) return;

        setLines(prev => [...prev, `root@research_node:~$ ${input}`]);
        setInput('');

        switch (primary) {
            case 'help':
                setLines(prev => [...prev, 
                    "COMMANDS:", 
                    "  - ssh <target>: Simulate remote connection", 
                    "  - worm: Simulate propagation protocol",
                    "  - grid: Scan nodes", 
                    "  - status: Core health", 
                    "  - exit: Close shell"
                ]);
                break;
            case 'status':
                setLines(prev => [...prev, "[SYNC] Heartbeat verified.", "[INFO] 24 uplink clusters active."]);
                break;
            case 'grid':
                setLines(prev => [...prev, "[SCAN] Scanning local grid...", "[OK] 127.0.0.1:3000", "[OK] 127.0.0.1:3001", "[OK] 127.0.0.1:3002"]);
                break;
            case 'ssh':
                if (args[1]) {
                    await simulateSSH(args[1]);
                } else {
                    setLines(prev => [...prev, "ERR: Target required. Usage: ssh <target>"]);
                }
                break;
            case 'worm':
                await simulateWorm();
                break;
            case 'exit':
                onClose();
                return;
            default:
                setLines(prev => [...prev, `ERR: Unknown directive "${primary}"`]);
        }
    };

    return (
        <div className="w-full h-full bg-black flex flex-col font-mono text-[11px]">
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-1 leading-tight">
                {lines.map((line, i) => (
                    <div key={i} className={`
                        ${line.includes('ERR') ? 'text-red-500' : 
                          line.includes('GRANTED') || line.includes('SUCCESS') ? 'text-[#00ff41] font-bold' : 
                          line.startsWith('root@') ? 'text-[#00ff41]' : 'text-[#00ff41]/70'}
                    `}>
                        {line}
                    </div>
                ))}
                {isLocked && <div className="text-[#00ff41] animate-pulse">PROCESSING...</div>}
            </div>

            <form onSubmit={handleCommand} className="p-3 bg-zinc-900/50 border-t border-white/5 flex items-center gap-3 shrink-0">
                <span className="text-[#00ff41] font-bold opacity-60">#</span>
                <input 
                    autoFocus
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="bg-transparent border-none outline-none flex-1 text-[#00ff41]"
                    placeholder={isLocked ? "PROCESSING..." : "Input sequence..."}
                    spellCheck={false}
                    disabled={isLocked}
                />
            </form>
        </div>
    );
};

export default AuditTerminal;
