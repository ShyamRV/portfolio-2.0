import * as THREE from "three";

/**
 * Procedurally builds the hero "digital twin" as a set of equal-length point
 * forms that the shader morphs between across the scroll journey:
 *   0 human → 1 neural cloud → 2 DNA helix → 3 systems lattice →
 *   4 global constellation → 5 dispersion.
 * Points are interchangeable between forms (no correspondence needed), so the
 * morph reads as thousands of particles flowing into new shapes. No external
 * model assets — tiny and license-clean.
 */

type Vec3 = [number, number, number];

export const FORM_NAMES = [
  "human",
  "cloud",
  "helix",
  "lattice",
  "globe",
  "scatter",
] as const;
export const FORM_COUNT = FORM_NAMES.length;

function randUnit(): Vec3 {
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

const BONES: Bone[] = [
  { a: [0, 1.1, 0], b: [0, 0.1, 0], r0: 0.42, r1: 0.34, weight: 26 },
  { a: [-0.42, 1.02, 0], b: [-0.62, 0.4, 0.04], r0: 0.13, r1: 0.1, weight: 9 },
  { a: [-0.62, 0.4, 0.04], b: [-0.72, -0.12, 0.1], r0: 0.1, r1: 0.08, weight: 8 },
  { a: [0.42, 1.02, 0], b: [0.62, 0.4, 0.04], r0: 0.13, r1: 0.1, weight: 9 },
  { a: [0.62, 0.4, 0.04], b: [0.72, -0.12, 0.1], r0: 0.1, r1: 0.08, weight: 8 },
  { a: [-0.19, 0.1, 0], b: [-0.21, -0.85, 0.02], r0: 0.18, r1: 0.14, weight: 12 },
  { a: [-0.21, -0.85, 0.02], b: [-0.22, -1.7, 0.05], r0: 0.13, r1: 0.09, weight: 10 },
  { a: [0.19, 0.1, 0], b: [0.21, -0.85, 0.02], r0: 0.18, r1: 0.14, weight: 12 },
  { a: [0.21, -0.85, 0.02], b: [0.22, -1.7, 0.05], r0: 0.13, r1: 0.09, weight: 10 },
];
const HEAD: Vec3 = [0, 1.5, 0];
const HEAD_R = 0.33;
const HEAD_WEIGHT = 16;

function sampleHuman(): Vec3 {
  const total = HEAD_WEIGHT + BONES.reduce((s, b) => s + b.weight, 0);
  let pick = Math.random() * total;
  if (pick < HEAD_WEIGHT) return sampleSphere(HEAD, HEAD_R, 0.55);
  pick -= HEAD_WEIGHT;
  for (const bone of BONES) {
    if (pick < bone.weight) return sampleCapsule(bone.a, bone.b, bone.r0, bone.r1);
    pick -= bone.weight;
  }
  return sampleCapsule(BONES[0]!.a, BONES[0]!.b, BONES[0]!.r0, BONES[0]!.r1);
}

const HUBS: Vec3[] = Array.from({ length: 7 }, () => {
  const d = randUnit();
  const r = 1.1 + Math.random() * 0.7;
  return [d[0] * r, d[1] * r * 1.2, d[2] * r];
});

function sampleCloud(): Vec3 {
  if (Math.random() < 0.55) return sampleSphere([0, 0, 0], 2.1, 0.55);
  const hub = HUBS[Math.floor(Math.random() * HUBS.length)]!;
  return sampleSphere(hub, 0.4, 0.2);
}

function sampleHelix(): Vec3 {
  const turns = 3.4;
  const t = Math.random();
  const y = (t - 0.5) * 3.6;
  const angle = t * Math.PI * 2 * turns;
  const radius = 0.95;
  const jitter = 0.05;
  const roll = Math.random();
  if (roll < 0.42) {
    // strand A
    return [
      Math.cos(angle) * radius + (Math.random() - 0.5) * jitter,
      y,
      Math.sin(angle) * radius + (Math.random() - 0.5) * jitter,
    ];
  } else if (roll < 0.84) {
    // strand B (opposite phase)
    return [
      Math.cos(angle + Math.PI) * radius + (Math.random() - 0.5) * jitter,
      y,
      Math.sin(angle + Math.PI) * radius + (Math.random() - 0.5) * jitter,
    ];
  }
  // base-pair rung between strands
  const k = Math.random();
  return [
    Math.cos(angle) * radius * (1 - 2 * k),
    y,
    Math.sin(angle) * radius * (1 - 2 * k),
  ];
}

function sampleLattice(): Vec3 {
  // Structured "systems" grid: points snapped to a 3D lattice with jitter,
  // biased to the wireframe edges of a cube for a circuit-like read.
  const n = 6;
  const cell = 3.0 / n;
  const half = 1.5;
  const gx = Math.floor(Math.random() * (n + 1));
  const gy = Math.floor(Math.random() * (n + 1));
  const gz = Math.floor(Math.random() * (n + 1));
  const j = 0.04;
  return [
    -half + gx * cell + (Math.random() - 0.5) * j,
    -half + gy * cell + (Math.random() - 0.5) * j,
    -half + gz * cell + (Math.random() - 0.5) * j,
  ];
}

const FIB = (1 + Math.sqrt(5)) / 2;
function sampleGlobe(i: number, count: number): Vec3 {
  // Fibonacci sphere surface for an even "planet" shell.
  const t = (i + 0.5) / count;
  const inclination = Math.acos(1 - 2 * t);
  const azimuth = 2 * Math.PI * i * (1 / FIB);
  const r = 1.85 + (Math.random() - 0.5) * 0.06;
  return [
    r * Math.sin(inclination) * Math.cos(azimuth),
    r * Math.cos(inclination),
    r * Math.sin(inclination) * Math.sin(azimuth),
  ];
}

function sampleScatter(): Vec3 {
  const d = randUnit();
  const r = 2.2 + Math.random() * 2.8;
  return [d[0] * r, d[1] * r, d[2] * r];
}

export interface FormBuffers {
  count: number;
  forms: Float32Array[]; // one per FORM_NAMES entry
  seed: Float32Array;
  size: Float32Array;
}

export function buildForms(count: number): FormBuffers {
  const forms: Float32Array[] = Array.from(
    { length: FORM_COUNT },
    () => new Float32Array(count * 3),
  );
  const seed = new Float32Array(count);
  const size = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const samples: Vec3[] = [
      sampleHuman(),
      sampleCloud(),
      sampleHelix(),
      sampleLattice(),
      sampleGlobe(i, count),
      sampleScatter(),
    ];
    for (let f = 0; f < FORM_COUNT; f++) {
      const s = samples[f]!;
      forms[f]![i * 3] = s[0];
      forms[f]![i * 3 + 1] = s[1];
      forms[f]![i * 3 + 2] = s[2];
    }
    seed[i] = Math.random();
    size[i] = 0.6 + Math.random() * 1.4;
  }

  return { count, forms, seed, size };
}

export function makeFormGeometry(buffers: FormBuffers): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  // position = current form, aTo = next form; both updated on chapter change.
  geo.setAttribute("position", new THREE.BufferAttribute(buffers.forms[0]!.slice(), 3));
  geo.setAttribute("aTo", new THREE.BufferAttribute(buffers.forms[1]!.slice(), 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(buffers.seed, 1));
  geo.setAttribute("aSize", new THREE.BufferAttribute(buffers.size, 1));
  return geo;
}
