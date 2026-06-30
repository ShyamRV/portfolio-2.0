// Classic Ashima 3D simplex noise (public domain) — used for organic motion.
const SIMPLEX = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+1.0*C.xxx;
  vec3 x2=x0-i2+2.0*C.xxx;
  vec3 x3=x0-1.0+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

export const FIGURE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uMorph;        // 0 = humanoid, 1 = neural cloud
uniform float uDisperse;     // 0 = assembled, 1 = scattered (intro)
uniform vec3  uMouse;        // mouse in world space (z=0 plane)
uniform float uMouseStrength;
uniform float uPixelRatio;
uniform float uSize;

attribute vec3  aCloud;
attribute float aSeed;
attribute float aSize;

varying float vGlow;
varying float vSeed;

${SIMPLEX}

void main() {
  vSeed = aSeed;

  float m = smoothstep(0.0, 1.0, uMorph);
  vec3 pos = mix(position, aCloud, m);

  // Organic flow-noise displacement (more agitated in cloud form).
  float t = uTime * 0.18;
  float amp = mix(0.018, 0.16, m) + uDisperse * 0.6;
  vec3 nIn = pos * 0.7 + vec3(aSeed * 10.0);
  vec3 flow = vec3(
    snoise(nIn + vec3(t, 0.0, 0.0)),
    snoise(nIn + vec3(0.0, t, 5.0)),
    snoise(nIn + vec3(3.0, 0.0, t))
  );
  pos += flow * amp;

  // Intro dispersion: blow particles outward then let them settle.
  pos += normalize(pos + 0.001) * uDisperse * (1.5 + aSeed * 2.0);

  // Breathing.
  pos *= 1.0 + sin(uTime * 0.8 + aSeed * 6.2831) * 0.012;

  // Cursor repulsion (in world XY).
  vec3 toMouse = pos - uMouse;
  float d = length(toMouse.xy);
  float push = uMouseStrength * exp(-d * d * 1.6);
  pos.xy += normalize(toMouse.xy + 0.0001) * push;

  float energy = length(flow);
  vGlow = clamp(energy * 0.6 + push * 1.5 + m * 0.3, 0.0, 1.0);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float size = uSize * aSize * (1.0 + vGlow * 1.2);
  gl_PointSize = size * uPixelRatio * (12.0 / -mvPosition.z);
}
`;

export const FIGURE_FRAGMENT = /* glsl */ `
precision highp float;

uniform vec3 uColorA;  // cyan
uniform vec3 uColorB;  // violet
uniform vec3 uColorHot; // near-white core for high energy

varying float vGlow;
varying float vSeed;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  if (dist > 0.5) discard;

  // Soft glowing disc with a brighter core.
  float core = smoothstep(0.5, 0.0, dist);
  float halo = smoothstep(0.5, 0.15, dist);

  vec3 base = mix(uColorA, uColorB, vSeed);
  vec3 col = mix(base, uColorHot, vGlow * core * 0.7);

  float alpha = halo * (0.13 + vGlow * 0.32);
  gl_FragColor = vec4(col * (0.45 + vGlow * 0.7), alpha);
}
`;
