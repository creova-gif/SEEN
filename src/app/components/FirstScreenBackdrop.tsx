import { motion } from "motion/react";

/**
 * Original, code-drawn motion for the first screen (PR-6): soft light drifting like projector glow, and a quiet
 * sound-wave along the bottom, for story, film and sound in one image. No footage, nothing to download.
 * It sits behind the protected entry screen and never changes its content or order. Colors are the existing
 * accents at very low strength, so the S.E.E.N text keeps its contrast. With reduced motion it is a still frame.
 */
const ORBS = [
  { color: "rgba(192, 132, 252, 0.20)", size: 420, from: { x: "-25%", y: "-10%" }, to: { x: "-5%", y: "8%" }, duration: 18 }, // creator accent
  { color: "rgba(255, 226, 158, 0.10)", size: 360, from: { x: "55%", y: "55%" }, to: { x: "40%", y: "40%" }, duration: 22 }, // editorial gold
  { color: "rgba(96, 165, 250, 0.14)", size: 380, from: { x: "50%", y: "-15%" }, to: { x: "30%", y: "5%" }, duration: 26 }, // institutional blue
];
const BARS = Array.from({ length: 32 }, (_, i) => ({ i, base: 0.25 + 0.55 * Math.abs(Math.sin(i * 1.7)) }));

export function FirstScreenBackdrop({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden data-testid="first-screen-backdrop" className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10" />
      {ORBS.map((o, k) => (
        <motion.div
          key={k}
          initial={o.from}
          animate={reduce ? o.from : { x: [o.from.x, o.to.x, o.from.x], y: [o.from.y, o.to.y, o.from.y] }}
          transition={reduce ? { duration: 0 } : { duration: o.duration, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: o.size, height: o.size, background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)` }}
          className="absolute rounded-full blur-2xl"
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-24 flex items-end justify-center gap-[3px] px-6 opacity-[0.14]">
        {BARS.map(b => (
          <motion.span
            key={b.i}
            style={{ height: "100%", originY: 1 }}
            initial={{ scaleY: b.base }}
            animate={reduce ? { scaleY: b.base } : { scaleY: [b.base, Math.min(1, b.base + 0.35), Math.max(0.12, b.base - 0.2), b.base] }}
            transition={reduce ? { duration: 0 } : { duration: 4 + (b.i % 5), repeat: Infinity, ease: "easeInOut", delay: (b.i % 8) * 0.25 }}
            className="w-[3px] rounded-full bg-white"
          />
        ))}
      </div>
    </div>
  );
}
