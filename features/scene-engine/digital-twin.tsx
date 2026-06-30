"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { buildFigure, makeFigureGeometry } from "./figure-geometry";
import { FIGURE_VERTEX, FIGURE_FRAGMENT } from "./figure-shaders";
import { scrollState } from "./scroll-store";

interface DigitalTwinProps {
  count: number;
  pixelRatio: number;
}

/**
 * The hero "digital twin": a humanoid GPU point-cloud that assembles on load,
 * breathes, reacts to the cursor, and dissolves into a neural cloud on scroll.
 */
export function DigitalTwin({ count, pixelRatio }: DigitalTwinProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const disperse = useRef(1); // starts scattered → assembles to 0
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    return makeFigureGeometry(buildFigure(count));
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uDisperse: { value: 1 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseStrength: { value: 0.0 },
      uPixelRatio: { value: pixelRatio },
      uSize: { value: 3.6 },
      uColorA: { value: new THREE.Color("#22d3ee") },
      uColorB: { value: new THREE.Color("#7c3aed") },
      uColorHot: { value: new THREE.Color("#dffaff") },
    }),
    [pixelRatio],
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;

    // Ease the intro dispersion to zero (assembly).
    disperse.current += (0 - disperse.current) * Math.min(1, delta * 0.8);
    uniforms.uDisperse.value = disperse.current;

    // Scroll drives the humanoid → cloud morph.
    uniforms.uMorph.value = THREE.MathUtils.clamp(scrollState.smooth * 1.4, 0, 1);

    // Project pointer onto the z=0 plane in world space.
    uniforms.uMouse.value.set(
      (scrollState.smoothPointerX * viewport.width) / 2,
      (scrollState.smoothPointerY * viewport.height) / 2,
      0,
    );
    uniforms.uMouseStrength.value = 0.5;

    // Slow turntable + subtle pointer-driven tilt to reveal the 3D body.
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.09;
      pointsRef.current.rotation.x +=
        (scrollState.smoothPointerY * 0.12 - pointsRef.current.rotation.x) *
        0.04;
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
