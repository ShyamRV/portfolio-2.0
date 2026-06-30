"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { scrollState } from "./scroll-store";

interface CameraRigProps {
  /** Strength of pointer parallax. */
  parallax?: number;
  /** How far the camera dollies back across the full scroll (world units). */
  dolly?: number;
}

/**
 * Drives the camera from the shared scroll store: subtle pointer parallax plus
 * a gentle dolly/orbit tied to scroll progress. Runs inside the R3F loop.
 */
export function CameraRig({ parallax = 0.6, dolly = 2.5 }: CameraRigProps) {
  const { camera } = useThree();

  useFrame(() => {
    const px = scrollState.smoothPointerX;
    const py = scrollState.smoothPointerY;
    const p = scrollState.smooth;

    const targetX = px * parallax;
    const targetY = py * parallax * 0.6;
    const targetZ = 6 + p * dolly;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
