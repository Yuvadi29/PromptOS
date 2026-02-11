'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

interface FloatingMeshProps {
    geometry?: 'icosahedron' | 'octahedron' | 'torus';
    color?: string;
    scale?: number;
    speed?: number;
    distort?: number;
}

function Mesh({ geometry = 'icosahedron', color = '#f97316', scale = 1.5, speed = 2, distort = 0.3 }: FloatingMeshProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
    });

    const geometryComponent = (() => {
        switch (geometry) {
            case 'octahedron':
                return <octahedronGeometry args={[1, 0]} />;
            case 'torus':
                return <torusGeometry args={[1, 0.4, 32, 64]} />;
            default:
                return <icosahedronGeometry args={[1, 1]} />;
        }
    })();

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
            <mesh ref={meshRef} scale={scale}>
                {geometryComponent}
                <MeshDistortMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.8}
                    distort={distort}
                    speed={speed}
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </Float>
    );
}

export default function FloatingElement(props: FloatingMeshProps & { className?: string }) {
    const { className, ...meshProps } = props;

    return (
        <div className={className || 'w-full h-full'}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[5, 5, 5]} intensity={0.5} />
                    <pointLight position={[-3, -3, -3]} intensity={0.5} color="#f97316" />
                    <Mesh {...meshProps} />
                    <fog attach="fog" args={['#09090b', 5, 15]} />
                </Suspense>
            </Canvas>
        </div>
    );
}
