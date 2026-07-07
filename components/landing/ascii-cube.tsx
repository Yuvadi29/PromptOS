'use client';

import { useEffect, useRef } from 'react';

export function AsciiCube({}: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const chars = '@#%&*+=-:. ';
    const size = 80;

    const vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];

    const rotateX = (point: number[], a: number): number[] => {
      const [x, y, z] = point;
      return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
    };

    const rotateY = (point: number[], a: number): number[] => {
      const [x, y, z] = point;
      return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
    };

    const rotateZ = (point: number[], a: number): number[] => {
      const [x, y, z] = point;
      return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
    };

    const project = (point: number[]): [number, number, number] => {
      const scale = 2 / (4 + point[2]);
      return [point[0] * scale, point[1] * scale, point[2]];
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(8, 12, 20, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const buffer: string[][] = Array(size)
        .fill(null)
        .map(() => Array(size).fill(' '));
      const zBuffer: number[][] = Array(size)
        .fill(null)
        .map(() => Array(size).fill(-Infinity));

      const rotatedVertices = vertices.map((v) => {
        let point = rotateX(v, angle * 0.7);
        point = rotateY(point, angle);
        point = rotateZ(point, angle * 0.5);
        return project(point);
      });

      edges.forEach(([start, end]) => {
        const [x1, y1] = rotatedVertices[start];
        const [x2, y2] = rotatedVertices[end];
        const z1 = rotatedVertices[start][2];
        const z2 = rotatedVertices[end][2];

        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = x1 + (x2 - x1) * t;
          const y = y1 + (y2 - y1) * t;
          const z = z1 + (z2 - z1) * t;

          const px = Math.floor((x + 1) * (size / 2.5) + size / 5);
          const py = Math.floor((y + 1) * (size / 2.5) + size / 5);

          if (px >= 0 && px < size && py >= 0 && py < size) {
            if (z > zBuffer[py][px]) {
              zBuffer[py][px] = z;
              const charIndex = Math.floor(((z + 1) * (chars.length - 1)) / 2);
              buffer[py][px] = chars[Math.max(0, Math.min(chars.length - 1, charIndex))];
            }
          }
        }
      });

      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = 'oklch(0.7 0.18 170)';

      buffer.forEach((row, y) => {
        row.forEach((char, x) => {
          if (char !== ' ') {
            const z = zBuffer[y][x];
            const alpha = ((z + 1) / 2) * 0.8 + 0.2;
            ctx.fillStyle = `oklch(0.7 0.18 170 / ${alpha})`;
            ctx.fillText(char, x * 6, y * 8 + 8);
          }
        });
      });

      angle += 0.015;
      animationId = requestAnimationFrame(animate);
    };

    canvas.width = size * 6;
    canvas.height = size * 8;
    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return null;
}
