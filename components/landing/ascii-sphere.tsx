'use client';

import { useEffect, useRef } from 'react';

export function AsciiSphere({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = '.:-=+*#%@';
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);
      ctx.font = '10px JetBrains Mono, monospace';

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;

      const charWidth = 7;
      const charHeight = 12;

      for (let y = -radius; y < radius; y += charHeight) {
        for (let x = -radius; x < radius; x += charWidth) {
          const distFromCenter = Math.sqrt(x * x + y * y);

          if (distFromCenter < radius) {
            // Calculate 3D position on sphere
            const z = Math.sqrt(Math.max(0, radius * radius - x * x - y * y));

            // Rotate around Y axis
            const rotatedX = x * Math.cos(time * 0.5) - z * Math.sin(time * 0.5);
            const rotatedZ = x * Math.sin(time * 0.5) + z * Math.cos(time * 0.5);

            // Calculate lighting based on rotated normal
            const nx = rotatedX / radius;
            const ny = y / radius;
            const nz = rotatedZ / radius;

            // Light coming from top-right-front
            const lightX = 0.5;
            const lightY = -0.5;
            const lightZ = 0.7;
            const lightMag = Math.sqrt(lightX * lightX + lightY * lightY + lightZ * lightZ);

            const dot = (nx * lightX + ny * lightY + nz * lightZ) / lightMag;
            const brightness = Math.max(0, dot);

            const charIndex = Math.floor(brightness * (chars.length - 1));
            const char = chars[charIndex];

            // Grayscale based on brightness only
            const lightness = 10 + brightness * 60;

            ctx.fillStyle = `hsl(0, 0%, ${lightness}%)`;
            ctx.fillText(char, centerX + x, centerY + y);
          }
        }
      }

      time += 0.015;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
}
