'use client';

import { useEffect, useRef } from 'react';

export function AsciiTorus({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let A = 0;
    let B = 0;

    const width = 80;
    const height = 50;
    const chars = '.,-~:;=!*#$@';

    const R1 = 1;
    const R2 = 2;
    const K2 = 5;
    const K1 = (width * K2 * 3) / (8 * (R1 + R2));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const output: string[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(' '));
      const zbuffer: number[][] = Array(height)
        .fill(null)
        .map(() => Array(width).fill(0));

      const sinA = Math.sin(A);
      const cosA = Math.cos(A);
      const sinB = Math.sin(B);
      const cosB = Math.cos(B);

      for (let theta = 0; theta < 6.28; theta += 0.07) {
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let phi = 0; phi < 6.28; phi += 0.02) {
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);

          const circleX = R2 + R1 * cosTheta;
          const circleY = R1 * sinTheta;

          const x = circleX * (cosB * cosPhi + sinA * sinB * sinPhi) - circleY * cosA * sinB;
          const y = circleX * (sinB * cosPhi - sinA * cosB * sinPhi) + circleY * cosA * cosB;
          const z = K2 + cosA * circleX * sinPhi + circleY * sinA;
          const ooz = 1 / z;

          const xp = Math.floor(width / 2 + K1 * ooz * x);
          const yp = Math.floor(height / 2 - K1 * ooz * y * 0.5);

          const L =
            cosPhi * cosTheta * sinB -
            cosA * cosTheta * sinPhi -
            sinA * sinTheta +
            cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);

          if (L > 0 && xp >= 0 && xp < width && yp >= 0 && yp < height) {
            if (ooz > zbuffer[yp][xp]) {
              zbuffer[yp][xp] = ooz;
              const luminanceIndex = Math.floor(L * 8);
              output[yp][xp] = chars[Math.min(luminanceIndex, chars.length - 1)];
            }
          }
        }
      }

      ctx.font = '12px JetBrains Mono, monospace';

      output.forEach((row, y) => {
        row.forEach((char, x) => {
          if (char !== ' ') {
            const luminance = chars.indexOf(char) / chars.length;
            const alpha = 0.3 + luminance * 0.7;
            ctx.fillStyle = `oklch(${0.5 + luminance * 0.3} 0.18 170 / ${alpha})`;
            ctx.fillText(char, x * 10, y * 14 + 14);
          }
        });
      });

      A += 0.04;
      B += 0.02;
      animationId = requestAnimationFrame(animate);
    };

    canvas.width = width * 10;
    canvas.height = height * 14;
    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas ref={canvasRef} className={`${className}`} style={{ imageRendering: 'pixelated' }} />
  );
}
