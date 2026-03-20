"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
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

const cardClass =
  "rounded-2xl border border-zinc-100 bg-white shadow-sm hover:shadow-md transition-shadow";

function cardSpan(i: number) {
  if (i === 0) return "lg:col-span-2 lg:row-span-2";
  if (i === 3) return "lg:col-span-3";
  return "";
}

function LargeCard({ item }: { item: ServiceItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Symmetric range: image is 200% tall, centered at -50%, y moves ±25% of its height (±50% of container)
  // At both extremes the image still fully covers the container — no gaps
  const y = useTransform(scrollYProgress, [0, 1], ["-25%", "25%"]);

  return (
    <div ref={ref} className="flex h-full flex-col">
      {/* Image area — rounded top corners clip with the card */}
      <div className="relative min-h-64 flex-1 overflow-hidden rounded-t-2xl">
        <motion.img
          src="/design-2.jpg"
          alt=""
          aria-hidden
          className="absolute left-0 right-0 w-full object-cover object-center pointer-events-none select-none"
          style={{ y, height: "200%", top: "-50%" }}
        />
      </div>
      {/* Text area */}
      <div className="p-8">
        <h3 className="mb-3 text-lg font-bold text-zinc-900">{item.title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function Services({ services }: ServicesProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {services.items.map((item, i) => (
          <motion.div
            key={item.title}
            className={`${cardClass} ${cardSpan(i)} h-full overflow-hidden`}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.1 + i * 0.12,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
          >
            {/* Card 0 — large, parallax image */}
            {i === 0 && <LargeCard item={item} />}

            {/* Cards 1, 2 — compact */}
            {(i === 1 || i === 2) && (
              <div className="flex h-full flex-col p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-sm font-semibold text-zinc-900">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            {/* Card 3 — full-width horizontal */}
            {i === 3 && (
              <div className="flex flex-col gap-4 p-8 lg:flex-row lg:items-center lg:gap-10">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

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
