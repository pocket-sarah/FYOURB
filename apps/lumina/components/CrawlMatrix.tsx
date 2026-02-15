
import React, { useEffect, useRef } from 'react';

const CrawlMatrix: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*()_+=[]{}|;:,.<>?/πΩΣΔ";
        const fontSize = 14;
        const columns = width / fontSize;
        const drops: number[] = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = "rgba(2, 6, 23, 0.1)";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = isActive ? "#10b981" : "#6366f1";
            ctx.font = `${fontSize}px 'JetBrains Mono'`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive]);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default CrawlMatrix;
