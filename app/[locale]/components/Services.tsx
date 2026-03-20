"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

interface ServicesDict {
  title_line1: string;
  title_line2: string;
  stack_label: string;
  items: ServiceItem[];
}

interface ServicesProps {
  services: ServicesDict;
}

const STACK = [
  {
    category: "Frontend",
    color: "indigo",
    items: ["React.js", "Next.js", "JavaScript", "Redux.js", "HTML5", "CSS", "SASS"],
  },
  {
    category: "Backend",
    color: "blue",
    items: ["Node.js", "Express.js", "C#", "ASP.NET", ".NET Framework"],
  },
  {
    category: "Database",
    color: "emerald",
    items: ["SQL", "MySQL", "MongoDB"],
  },
  {
    category: "Cloud & DevOps",
    color: "amber",
    items: ["Azure", "Docker", "Kubernetes", "DigitalOcean", "Bash"],
  },
  {
    category: "AI & Tools",
    color: "violet",
    items: ["NLP", "Dialogflow", "Bot Framework", "AR Foundation", "Unity", "VS Code"],
  },
];

const PILL_COLORS: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-700",
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
};

const CARD_STYLES = [
  {
    wrapper: "bg-indigo-600 hover:brightness-110 transition-[filter]",
    title: "text-white",
    desc: "text-white/70",
    cta: "text-white/90",
  },
  {
    wrapper: "bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow",
    title: "text-zinc-900",
    desc: "text-zinc-500",
    cta: "text-zinc-700",
  },
  {
    wrapper: "bg-zinc-100 hover:shadow-md transition-shadow",
    title: "text-zinc-900",
    desc: "text-zinc-500",
    cta: "text-zinc-700",
  },
  {
    wrapper: "bg-indigo-50 hover:shadow-md transition-shadow",
    title: "text-indigo-900",
    desc: "text-indigo-400",
    cta: "text-indigo-600",
  },
];

// Modal accent colors per card index
const MODAL_ACCENTS = [
  { badge: "bg-indigo-600 text-white", check: "text-indigo-600" },
  { badge: "bg-zinc-900 text-white", check: "text-zinc-700" },
  { badge: "bg-zinc-700 text-white", check: "text-zinc-600" },
  { badge: "bg-indigo-500 text-white", check: "text-indigo-500" },
];

export default function Services({ services }: ServicesProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeItem = activeIndex !== null ? services.items[activeIndex] : null;
  const activeAccent = activeIndex !== null ? MODAL_ACCENTS[activeIndex % MODAL_ACCENTS.length] : MODAL_ACCENTS[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  return (
    <section
      id="services"
      ref={ref}
      className="px-6 py-16 md:px-8 md:py-24 xl:px-16 xl:py-32"
    >
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.items.map((item, i) => {
          const style = CARD_STYLES[i % CARD_STYLES.length];
          return (
            <motion.div
              key={item.title}
              className={`rounded-2xl p-8 flex flex-col justify-between min-h-55 relative overflow-hidden cursor-default ${style.wrapper}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.12,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
            >
              {/* Top: title + description */}
              <div>
                <h3 className={`text-xl font-bold leading-snug ${style.title}`}>
                  {item.title}
                </h3>
                <p className={`text-sm mt-2 leading-relaxed ${style.desc}`}>
                  {item.description}
                </p>
              </div>

              {/* Bottom: CTA + emoji */}
              <div className="flex items-end justify-between mt-6">
                <button
                  onClick={() => setActiveIndex(i)}
                  className={`text-xs font-semibold uppercase tracking-widest cursor-pointer hover:underline underline-offset-4 ${style.cta}`}
                >
                  Learn more →
                </button>
                <span
                  className="text-6xl leading-none select-none pointer-events-none"
                  aria-hidden
                >
                  {item.icon}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeItem && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveIndex(null)}
            />

            {/* Card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                className="pointer-events-auto w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              >
                {/* Header */}
                <div className="flex items-start justify-between p-8 pb-0">
                  <div className="flex items-center gap-4">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${activeAccent.badge}`}>
                      {activeItem.icon}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900 leading-snug max-w-55">
                      {activeItem.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveIndex(null)}
                    className="ml-4 shrink-0 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                    aria-label="Close"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="p-8">
                  <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                    {activeItem.description}
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                    What&apos;s included
                  </p>

                  <ul className="flex flex-col gap-3">
                    {activeItem.details.map((detail, i) => (
                      <motion.li
                        key={detail}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.15 + i * 0.07,
                          ease: [0.16, 1, 0.3, 1] as const,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className={`mt-0.5 shrink-0 ${activeAccent.check}`}
                        >
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-sm text-zinc-700">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Tech stack strip */}
      <motion.div
        className="mt-10 pt-8 border-t border-zinc-100"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {services.stack_label}
        </p>
        <div className="flex flex-col gap-4">
          {STACK.map(({ category, color, items }) => (
            <div key={category} className="flex flex-wrap items-center gap-2">
              <span className="mr-2 w-28 shrink-0 text-xs font-medium text-zinc-400">
                {category}
              </span>
              {items.map((item) => (
                <span
                  key={item}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${PILL_COLORS[color]}`}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
