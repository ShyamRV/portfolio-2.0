import * as THREE from "three";

/**
 * Procedurally builds the hero "digital twin": two equal-length point sets that
 * the shader morphs between — a humanoid figure (sampled from a capsule
 * skeleton) and a neural cloud (sphere shell + clustered nodes). No external
 * model assets, so it's tiny and license-clean.
 */

type Vec3 = [number, number, number];

function randUnit(): Vec3 {
  // Uniform point on unit sphere.
  const u = Math.random() * 2 - 1;
  const t = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - u * u);
  return [r * Math.cos(t), u, r * Math.sin(t)];
}

function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function sampleCapsule(a: Vec3, b: Vec3, r0: number, r1: number): Vec3 {
  const t = Math.random();
  const center = lerp3(a, b, t);
  const r = r0 + (r1 - r0) * t;
  const dir = randUnit();
  // Bias toward the surface for a luminous "shell" look.
  const rad = r * (0.6 + 0.4 * Math.cbrt(Math.random()));
  return [center[0] + dir[0] * rad, center[1] + dir[1] * rad, center[2] + dir[2] * rad];
}

function sampleSphere(center: Vec3, r: number, shell = 0.75): Vec3 {
  const dir = randUnit();
  const rad = r * (shell + (1 - shell) * Math.cbrt(Math.random()));
  return [center[0] + dir[0] * rad, center[1] + dir[1] * rad, center[2] + dir[2] * rad];
}

interface Bone {
  a: Vec3;
  b: Vec3;
  r0: number;
  r1: number;
  weight: number;
}

// Humanoid skeleton, centered on origin, ~3.5 units tall.
const BONES: Bone[] = [
  { a: [0, 1.1, 0], b: [0, 0.1, 0], r0: 0.42, r1: 0.34, weight: 26 }, // torso
  { a: [-0.42, 1.02, 0], b: [-0.62, 0.4, 0.04], r0: 0.13, r1: 0.1, weight: 9 }, // L upper arm
  { a: [-0.62, 0.4, 0.04], b: [-0.72, -0.12, 0.1], r0: 0.1, r1: 0.08, weight: 8 }, // L forearm
  { a: [0.42, 1.02, 0], b: [0.62, 0.4, 0.04], r0: 0.13, r1: 0.1, weight: 9 }, // R upper arm
  { a: [0.62, 0.4, 0.04], b: [0.72, -0.12, 0.1], r0: 0.1, r1: 0.08, weight: 8 }, // R forearm
  { a: [-0.19, 0.1, 0], b: [-0.21, -0.85, 0.02], r0: 0.18, r1: 0.14, weight: 12 }, // L thigh
  { a: [-0.21, -0.85, 0.02], b: [-0.22, -1.7, 0.05], r0: 0.13, r1: 0.09, weight: 10 }, // L shin
  { a: [0.19, 0.1, 0], b: [0.21, -0.85, 0.02], r0: 0.18, r1: 0.14, weight: 12 }, // R thigh
  { a: [0.21, -0.85, 0.02], b: [0.22, -1.7, 0.05], r0: 0.13, r1: 0.09, weight: 10 }, // R shin
];
const HEAD: Vec3 = [0, 1.5, 0];
const HEAD_R = 0.33;
const HEAD_WEIGHT = 16;

function sampleHumanoid(): Vec3 {
  const total =
    HEAD_WEIGHT + BONES.reduce((s, b) => s + b.weight, 0);
  let pick = Math.random() * total;
  if (pick < HEAD_WEIGHT) return sampleSphere(HEAD, HEAD_R, 0.55);
  pick -= HEAD_WEIGHT;
  for (const bone of BONES) {
    if (pick < bone.weight) return sampleCapsule(bone.a, bone.b, bone.r0, bone.r1);
    pick -= bone.weight;
  }
  return sampleCapsule(BONES[0]!.a, BONES[0]!.b, BONES[0]!.r0, BONES[0]!.r1);
}

// A few neural "hub" nodes for the cloud form.
const HUBS: Vec3[] = Array.from({ length: 7 }, () => {
  const d = randUnit();
  const r = 1.1 + Math.random() * 0.7;
  return [d[0] * r, d[1] * r * 1.2, d[2] * r];
});

function sampleCloud(): Vec3 {
  // 55% diffuse shell, 45% clustered around hubs (neuron-like).
  if (Math.random() < 0.55) {
    return sampleSphere([0, 0, 0], 2.1, 0.55);
  }
  const hub = HUBS[Math.floor(Math.random() * HUBS.length)]!;
  return sampleSphere(hub, 0.4, 0.2);
}

export interface FigureBuffers {
  count: number;
  human: Float32Array;
  cloud: Float32Array;
  seed: Float32Array;
  size: Float32Array;
}

export function buildFigure(count: number): FigureBuffers {
  const human = new Float32Array(count * 3);
  const cloud = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const size = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const h = sampleHumanoid();
    const c = sampleCloud();
    human[i * 3] = h[0];
    human[i * 3 + 1] = h[1];
    human[i * 3 + 2] = h[2];
    cloud[i * 3] = c[0];
    cloud[i * 3 + 1] = c[1];
    cloud[i * 3 + 2] = c[2];
    seed[i] = Math.random();
    size[i] = 0.6 + Math.random() * 1.4;
  }

  return { count, human, cloud, seed, size };
}

export function makeFigureGeometry(buffers: FigureBuffers): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(buffers.human, 3));
  geo.setAttribute("aCloud", new THREE.BufferAttribute(buffers.cloud, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(buffers.seed, 1));
  geo.setAttribute("aSize", new THREE.BufferAttribute(buffers.size, 1));
  return geo;
}
