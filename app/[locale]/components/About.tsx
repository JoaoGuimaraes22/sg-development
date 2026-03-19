"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface FunFact {
  emoji: string;
  text: string;
}

interface AboutDict {
  title_line1: string;
  title_line2: string;
  bio: string;
  fun_facts: FunFact[];
}

interface AboutProps {
  about: AboutDict;
}

export default function About({ about }: AboutProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const bioParagraphs = about.bio.split("\n\n");

  return (
    <section id="about" ref={ref} className="px-6 py-16 md:px-8 md:py-24 xl:px-16 xl:py-32">
      <motion.div
        className="leading-none mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <h2 className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem] text-zinc-900">
          {about.title_line1}
        </h2>
        <h2 className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem] text-zinc-200">
          {about.title_line2}
        </h2>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
          className="space-y-4"
        >
          {bioParagraphs.map((para, i) => (
            <p key={i} className="text-sm text-zinc-500 leading-relaxed">
              {para}
            </p>
          ))}
        </motion.div>

        {/* Fun facts */}
        <div className="grid grid-cols-2 gap-3 content-start">
          {about.fun_facts.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
              className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm"
            >
              <p className="text-2xl mb-2">{fact.emoji}</p>
              <p className="text-xs text-zinc-500 leading-relaxed">{fact.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
