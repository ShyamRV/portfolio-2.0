"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { buildForms, makeFormGeometry, FORM_COUNT } from "./figure-geometry";
import { FIGURE_VERTEX, FIGURE_FRAGMENT } from "./figure-shaders";
import { scrollState } from "./scroll-store";

interface DigitalTwinProps {
  count: number;
  pixelRatio: number;
}

// Per-chapter accent colors (cyan→violet→green→amber…) for variety.
const PALETTE_A = [
  new THREE.Color("#22d3ee"),
  new THREE.Color("#22d3ee"),
  new THREE.Color("#34d399"),
  new THREE.Color("#38bdf8"),
  new THREE.Color("#a78bfa"),
  new THREE.Color("#22d3ee"),
];
const PALETTE_B = [
  new THREE.Color("#7c3aed"),
  new THREE.Color("#3b82f6"),
  new THREE.Color("#22d3ee"),
  new THREE.Color("#8b5cf6"),
  new THREE.Color("#22d3ee"),
  new THREE.Color("#7c3aed"),
];

/**
 * The hero "digital twin": a GPU point-cloud that assembles on load and then
 * morphs through every form across the scroll (human → cloud → helix →
 * lattice → globe → scatter), reacting to the cursor throughout.
 */
export function DigitalTwin({ count, pixelRatio }: DigitalTwinProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const disperse = useRef(1);
  const chapter = useRef(-1);
  const { viewport } = useThree();

  const buffers = useMemo(() => buildForms(count), [count]);
  const geometry = useMemo(() => makeFormGeometry(buffers), [buffers]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMix: { value: 0 },
      uActivity: { value: 0 },
      uDisperse: { value: 1 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseStrength: { value: 0.0 },
      uPixelRatio: { value: pixelRatio },
      uSize: { value: 3.6 },
      uColorA: { value: PALETTE_A[0]!.clone() },
      uColorB: { value: PALETTE_B[0]!.clone() },
      uColorHot: { value: new THREE.Color("#dffaff") },
    }),
    [pixelRatio],
  );

  const setChapter = (idx: number) => {
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const toAttr = geometry.getAttribute("aTo") as THREE.BufferAttribute;
    const from = buffers.forms[idx]!;
    const to = buffers.forms[Math.min(idx + 1, FORM_COUNT - 1)]!;
    (posAttr.array as Float32Array).set(from);
    (toAttr.array as Float32Array).set(to);
    posAttr.needsUpdate = true;
    toAttr.needsUpdate = true;
  };

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;

    disperse.current += (0 - disperse.current) * Math.min(1, delta * 0.8);
    uniforms.uDisperse.value = disperse.current;

    // Map scroll → chapter index + fractional progress between forms.
    const span = FORM_COUNT - 1;
    const c = THREE.MathUtils.clamp(scrollState.smooth, 0, 1) * span;
    const idx = Math.min(Math.floor(c), span - 1);
    const frac = c - idx;

    if (idx !== chapter.current) {
      chapter.current = idx;
      setChapter(idx);
      uniforms.uColorA.value.copy(PALETTE_A[idx] ?? PALETTE_A[0]!);
      uniforms.uColorB.value.copy(PALETTE_B[idx] ?? PALETTE_B[0]!);
    }

    const eased = frac * frac * (3 - 2 * frac);
    uniforms.uMix.value = eased;
    // Turbulence peaks in the middle of a transition.
    uniforms.uActivity.value = Math.sin(eased * Math.PI) * 0.9 + disperse.current;

    uniforms.uMouse.value.set(
      (scrollState.smoothPointerX * viewport.width) / 2,
      (scrollState.smoothPointerY * viewport.height) / 2,
      0,
    );
    uniforms.uMouseStrength.value = 0.5;

    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.09;
      pointsRef.current.rotation.x +=
        (scrollState.smoothPointerY * 0.12 - pointsRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={FIGURE_VERTEX}
        fragmentShader={FIGURE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
