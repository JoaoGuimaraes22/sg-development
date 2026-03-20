"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { type Locale } from "../../../i18n-config";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

const strings = {
  en: {
    title: "Chat with me",
    subtitle: "Typically replies instantly",
    placeholder: "Type a message...",
    greeting: "Hi! I'm João's assistant. Ask me anything about his work, services, or availability.",
    ariaLabel: "Open chat",
  },
  pt: {
    title: "Fala comigo",
    subtitle: "Responde quase instantaneamente",
    placeholder: "Escreve uma mensagem...",
    greeting: "Olá! Sou o assistente do João. Pergunta-me sobre o seu trabalho, serviços ou disponibilidade.",
    ariaLabel: "Abrir chat",
  },
};

export default function ChatWidget({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const greetedRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const s = strings[locale] ?? strings.en;

  useEffect(() => {
    if (open && !greetedRef.current) {
      greetedRef.current = true;
      setMessages([{ id: crypto.randomUUID(), role: "bot", text: s.greeting }]);
    }
  }, [open, s.greeting]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: { preventDefault(): void }) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId, locale }),
      });
      const { reply } = await res.json();
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "bot", text: reply }]);
    } catch {
      const fallback =
        locale === "pt" ? "Erro de ligação. Tenta novamente." : "Connection error. Please try again.";
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "bot", text: fallback }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ transformOrigin: "bottom right" }}
            className="w-80 sm:w-96 rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
              <div>
                <p className="text-sm font-semibold text-zinc-900">{s.title}</p>
                <p className="text-xs text-zinc-400">{s.subtitle}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors"
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto max-h-80 px-4 py-4 space-y-3 scrollbar-none">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.role === "bot"
                      ? "max-w-[80%] rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-700"
                      : "max-w-[80%] rounded-2xl rounded-tr-sm bg-indigo-600 px-4 py-2.5 text-sm text-white ml-auto"
                  }
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="flex gap-1 px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-zinc-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 px-4 py-3 border-t border-zinc-100"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={s.placeholder}
                className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4 20-7z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={s.ariaLabel}
        className="flex size-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-all"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
