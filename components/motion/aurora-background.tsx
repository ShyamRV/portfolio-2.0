/**
 * Decorative aurora gradient (Part 9 — used with restraint). Purely decorative
 * (aria-hidden, pointer-events-none). Motion is gated behind `motion-safe:` so
 * it is static for users who prefer reduced motion (Part 1, rule 10).
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-1/4 top-[-20%] h-[40rem] w-[40rem] rounded-full bg-accent/20 blur-3xl motion-safe:animate-aurora" />
      <div className="absolute right-[-10%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl motion-safe:animate-aurora [animation-delay:-6s]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
