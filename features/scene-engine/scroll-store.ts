"use client";

/**
 * Tiny global scroll store shared between the DOM and the R3F render loop.
 * Scenes read `progress`/`velocity` inside useFrame without re-rendering React.
 */
interface ScrollState {
  /** Normalized 0..1 over the full scrollable height. */
  progress: number;
  /** Smoothed progress (eased) for camera work. */
  smooth: number;
  velocity: number;
  /** Pointer in NDC-ish space (-1..1), used for parallax / repulsion. */
  pointerX: number;
  pointerY: number;
  smoothPointerX: number;
  smoothPointerY: number;
}

export const scrollState: ScrollState = {
  progress: 0,
  smooth: 0,
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
  smoothPointerX: 0,
  smoothPointerY: 0,
};

let raf = 0;

export function startScrollTracking() {
  if (typeof window === "undefined") return () => {};

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const next = max > 0 ? window.scrollY / max : 0;
    scrollState.velocity = next - scrollState.progress;
    scrollState.progress = next;
  };

  const onPointer = (e: PointerEvent) => {
    scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    scrollState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  // Smooth the values on a rAF loop so the 3D motion is never jittery.
  const tick = () => {
    scrollState.smooth += (scrollState.progress - scrollState.smooth) * 0.08;
    scrollState.smoothPointerX +=
      (scrollState.pointerX - scrollState.smoothPointerX) * 0.06;
    scrollState.smoothPointerY +=
      (scrollState.pointerY - scrollState.smoothPointerY) * 0.06;
    raf = requestAnimationFrame(tick);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  raf = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onPointer);
    cancelAnimationFrame(raf);
  };
}
