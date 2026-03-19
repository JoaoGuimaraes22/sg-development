"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Step {
  number: string;
  title: string;
  description: string;
}

interface ProcessDict {
  title_line1: string;
  title_line2: string;
  steps: Step[];
}

interface ProcessProps {
  process: ProcessDict;
}

export default function Process({ process }: ProcessProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" ref={ref} className="px-6 py-16 md:px-8 md:py-24 xl:px-16 xl:py-32">
      <motion.div
        className="leading-none mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <h2 className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem] text-zinc-900">
          {process.title_line1}
        </h2>
        <h2 className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem] text-zinc-200">
          {process.title_line2}
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
            className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
          >
            <p className="font-mono text-4xl font-black text-indigo-100 mb-4 select-none">
              {step.number}
            </p>
            <h3 className="text-sm font-semibold text-zinc-900 mb-2">{step.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
