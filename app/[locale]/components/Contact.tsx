"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface ContactDict {
  title_line1: string;
  title_line2: string;
  body: string;
  form_name: string;
  form_email: string;
  form_message: string;
  form_name_placeholder: string;
  form_email_placeholder: string;
  form_message_placeholder: string;
  form_submit: string;
  form_success: string;
  email_label: string;
  email: string;
  github: string;
  linkedin: string;
}

interface ContactProps {
  contact: ContactDict;
}

export default function Contact({ contact }: ContactProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  }

  return (
    <section id="contact" ref={ref} className="px-6 py-16 md:px-8 md:py-24 xl:px-16 xl:py-32">
      <motion.div
        className="leading-none mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <h2 className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem] text-zinc-900">
          {contact.title_line1}
        </h2>
        <h2 className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl xl:text-[7rem] text-zinc-200">
          {contact.title_line2}
        </h2>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left: body + social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <p className="text-sm text-zinc-500 leading-relaxed mb-8">{contact.body}</p>

          <div className="space-y-4">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 text-sm text-zinc-600 hover:text-indigo-600 transition-colors group"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm text-zinc-400 group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                ✉
              </span>
              <span>{contact.email}</span>
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-zinc-600 hover:text-indigo-600 transition-colors group"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm text-zinc-400 group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all text-xs font-mono">
                GH
              </span>
              <span>GitHub</span>
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-zinc-600 hover:text-indigo-600 transition-colors group"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-100 bg-white shadow-sm text-zinc-400 group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all text-xs font-semibold">
                in
              </span>
              <span>LinkedIn</span>
            </a>
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        >
          {submitted ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-sm text-emerald-700">
              {contact.form_success}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">{contact.form_name}</label>
                <input
                  type="text"
                  required
                  placeholder={contact.form_name_placeholder}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">{contact.form_email}</label>
                <input
                  type="email"
                  required
                  placeholder={contact.form_email_placeholder}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">{contact.form_message}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={contact.form_message_placeholder}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending…" : contact.form_submit}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
