"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Stat {
  value: string;
  label: string;
}

interface HeroDict {
  title_line1: string;
  title_line2: string;
  tagline: string;
  cta: string;
  cta_secondary: string;
  stats: Stat[];
}

export default function HeroFull({ hero }: { hero: HeroDict }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Background moves at 30% of scroll speed → parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-screen flex-col justify-end overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.img
        src="/hero.jpg"
        alt=""
        aria-hidden
        className="absolute inset-x-0 top-0 h-[130%] w-full object-cover object-top pointer-events-none select-none"
        style={{ y: bgY }}
      />

      {/* Gradient overlay — heavier at bottom for text legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-zinc-900/90 via-zinc-900/50 to-zinc-900/10" />

      {/* Content */}
      <div className="relative z-10 px-8 pb-20 pt-32 md:px-16 md:pb-28 xl:px-24">
        {/* Title */}
        <motion.div
          className="leading-none mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h1 className="font-black uppercase tracking-tight text-5xl sm:text-6xl md:text-7xl xl:text-[8rem] text-white">
            {hero.title_line1}
          </h1>
          <h1 className="font-black uppercase tracking-tight text-5xl sm:text-6xl md:text-7xl xl:text-[8rem] text-white/25">
            {hero.title_line2}
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="max-w-md text-base text-white/60 leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
        >
          {hero.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.25,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            {hero.cta}
          </a>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("work")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 hover:border-white/60 hover:text-white transition-colors"
          >
            {hero.cta_secondary}
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.35,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
        >
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-widest uppercase text-white/30">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/30"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
