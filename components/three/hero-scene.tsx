'use client';

import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ── Bokeh Particles ── */
function Particles({ count = 80 }) {
    const mesh = useRef<THREE.Points>(null!);

    const [positions, sizes] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const sz = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
            sz[i] = Math.random() * 3 + 1;
        }
        return [pos, sz];
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;
        mesh.current.rotation.y = state.clock.elapsedTime * 0.015;
        mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#f97316"
                transparent
                opacity={0.4}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

/* ── Ethereal Torus Knot ── */
function EtherealShape() {
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (!mesh.current) return;
        mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
        mesh.current.rotation.y = state.clock.elapsedTime * 0.08;
        mesh.current.scale.setScalar(
            1.8 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1
        );
    });

    return (
        <mesh ref={mesh} position={[1, 0, -2]}>
            <torusKnotGeometry args={[1, 0.35, 128, 16]} />
            <meshStandardMaterial
                color="#f97316"
                transparent
                opacity={0.06}
                wireframe
                emissive="#f97316"
                emissiveIntensity={0.15}
            />
        </mesh>
    );
}

/* ── Orbital Rings ── */
function OrbitalRing({ radius = 3, speed = 0.1 }: { radius?: number; speed?: number }) {
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (!mesh.current) return;
        mesh.current.rotation.x = Math.PI / 3 + state.clock.elapsedTime * speed;
        mesh.current.rotation.z = state.clock.elapsedTime * speed * 0.5;
    });

    return (
        <mesh ref={mesh}>
            <torusGeometry args={[radius, 0.005, 16, 100]} />
            <meshBasicMaterial
                color="#f97316"
                transparent
                opacity={0.12}
            />
        </mesh>
    );
}

/* ── Mouse Light ── */
function MouseLight() {
    const light = useRef<THREE.PointLight>(null!);
    const { viewport } = useThree();

    useFrame(({ pointer }) => {
        if (!light.current) return;
        light.current.position.x = (pointer.x * viewport.width) / 2;
        light.current.position.y = (pointer.y * viewport.height) / 2;
    });

    return <pointLight ref={light} intensity={0.5} color="#f97316" distance={12} />;
}

/* ── Scene ── */
function Scene() {
    return (
        <>
            <fog attach="fog" args={['#09090b', 5, 20]} />
            <ambientLight intensity={0.08} />
            <pointLight position={[5, 5, 5]} intensity={0.15} color="#f97316" />

            <Particles count={80} />
            <EtherealShape />
            <OrbitalRing radius={3.5} speed={0.06} />
            <OrbitalRing radius={5} speed={-0.04} />
            <Stars radius={100} depth={60} count={1000} factor={3} saturation={0} fade speed={0.3} />
            <MouseLight />
        </>
    );
}

export default function HeroScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}
