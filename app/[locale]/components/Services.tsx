"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

interface ServicesDict {
  title_line1: string;
  title_line2: string;
  items: ServiceItem[];
}

interface ServicesProps {
  services: ServicesDict;
}

export default function Services({ services }: ServicesProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" ref={ref} className="px-6 py-16 md:px-8 md:py-24 xl:px-16 xl:py-32">
      <motion.div
        className="leading-none mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <h2 className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem] text-zinc-900">
          {services.title_line1}
        </h2>
        <h2 className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem] text-zinc-200">
          {services.title_line2}
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        {services.items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
            className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
              {item.icon}
            </div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-900">{item.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
