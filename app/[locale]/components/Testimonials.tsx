"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar: string | null;
}

interface TestimonialsDict {
  title_line1: string;
  title_line2: string;
  items: TestimonialItem[];
}

interface TestimonialsProps {
  testimonials: TestimonialsDict;
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="testimonials" ref={ref} className="px-6 py-16 md:px-8 md:py-24 xl:px-16 xl:py-32 bg-zinc-50">
      <motion.div
        className="leading-none mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <h2 className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem] text-zinc-900">
          {testimonials.title_line1}
        </h2>
        <h2 className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem] text-zinc-200">
          {testimonials.title_line2}
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
            className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm flex flex-col gap-4"
          >
            {/* Quote mark */}
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" className="text-indigo-200 shrink-0">
              <path
                d="M0 18V10.8C0 7.2 1.2 4.2 3.6 1.8L5.4 0l2.4 1.8C6.6 3 5.7 4.5 5.4 6H9V18H0zm13.2 0V10.8c0-3.6 1.2-6.6 3.6-9L18.6 0l2.4 1.8C19.8 3 18.9 4.5 18.6 6H22.2V18H13.2z"
                fill="currentColor"
              />
            </svg>

            <p className="text-sm text-zinc-600 leading-relaxed flex-1">
              {item.quote}
            </p>

            <div className="flex items-center gap-3 pt-2 border-t border-zinc-50">
              {/* Avatar placeholder */}
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-indigo-600">
                  {item.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900">{item.name}</p>
                <p className="text-xs text-zinc-400">{item.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
