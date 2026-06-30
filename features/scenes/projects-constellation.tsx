"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import type { Project } from "@/lib/content/types";

const FIB = (1 + Math.sqrt(5)) / 2;

function nodePositions(n: number, radius = 2.6): THREE.Vector3[] {
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    const inc = Math.acos(1 - 2 * t);
    const azi = 2 * Math.PI * i * (1 / FIB);
    return new THREE.Vector3(
      radius * Math.sin(inc) * Math.cos(azi),
      radius * Math.cos(inc),
      radius * Math.sin(inc) * Math.sin(azi),
    );
  });
}

function ProjectNode({
  position,
  project,
  selected,
  onSelect,
}: {
  position: THREE.Vector3;
  project: Project;
  selected: boolean;
  onSelect: (slug: string) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const active = hovered || selected;

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = active ? 1.7 : project.featured ? 1.1 : 0.8;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 8);
  });

  return (
    <group position={position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project.slug);
        }}
      >
        <icosahedronGeometry args={[0.12, 1]} />
        <meshBasicMaterial
          color={active ? "#dffaff" : project.featured ? "#22d3ee" : "#7c3aed"}
          toneMapped={false}
        />
      </mesh>
      <Html
        center
        distanceFactor={9}
        position={[0, 0.32, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-wider transition-opacity ${
            active ? "text-hologram opacity-100" : "text-white/55 opacity-80"
          }`}
        >
          {project.title.split(" — ")[0]}
        </div>
      </Html>
    </group>
  );
}

function Constellation({
  projects,
  selected,
  onSelect,
}: {
  projects: Project[];
  selected: string | null;
  onSelect: (slug: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(
    () => nodePositions(projects.length),
    [projects.length],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    // Gentle tilt toward the pointer.
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.3,
      delta * 2,
    );
  });

  return (
    <group ref={group}>
      {/* Links from a central hub to each node. */}
      {positions.map((p, i) => (
        <Line
          key={`l-${i}`}
          points={[[0, 0, 0], [p.x, p.y, p.z]]}
          color="#22d3ee"
          transparent
          opacity={0.12}
          lineWidth={1}
        />
      ))}
      {/* Central core. */}
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshBasicMaterial color="#0a2a33" toneMapped={false} />
      </mesh>
      {positions.map((p, i) => {
        const project = projects[i]!;
        return (
          <ProjectNode
            key={project.slug}
            position={p}
            project={project}
            selected={selected === project.slug}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}

export function ProjectsConstellation({
  projects,
  selected,
  onSelect,
}: {
  projects: Project[];
  selected: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <Constellation
        projects={projects}
        selected={selected}
        onSelect={onSelect}
      />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
