"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Section } from "./section";

interface Citation {
  sourceUrl: string;
  similarity: number;
}
interface Msg {
  role: "user" | "assistant";
  text: string;
  citations?: Citation[];
}

const SUGGESTIONS = [
  "What did he build at Fetch.ai?",
  "Find robotics projects",
  "What talks has Shyam delivered?",
  "Show his research",
];

export function ConsoleSection() {
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Math.random()),
  );
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "I'm Shyam's portfolio assistant. Ask me about his projects, research, talks, or stack — I answer only from his real content.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, sessionId }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data.answer ?? "Something went wrong.",
          citations: data.citations,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "The assistant is unreachable right now. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section
      id="console"
      index="07"
      eyebrow="System Console"
      title={
        <>
          Ask the <span className="holo-text">digital twin</span>.
        </>
      }
    >
      <div className="holo-panel mx-auto flex h-[60vh] max-h-[560px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            shyam@portfolio: ~/assistant
          </span>
        </div>

        {/* Transcript */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className="font-mono text-sm">
              <span
                className={
                  m.role === "user" ? "text-synapse-1" : "text-hologram"
                }
              >
                {m.role === "user" ? "› " : "⬢ "}
              </span>
              <span className="text-foreground/90">{m.text}</span>
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 pl-4">
                  {m.citations.map((c, j) => (
                    <a
                      key={j}
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="hover"
                      className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-muted-foreground hover:text-synapse-1"
                    >
                      {new URL(c.sourceUrl).hostname}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> thinking…
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 pt-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              data-cursor="hover"
              onClick={() => send(s)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-synapse-1/40 hover:text-synapse-1"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 p-4"
        >
          <span className="font-mono text-synapse-1">›</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask about projects, research, talks…"
            className="flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            disabled={loading || !input.trim()}
            data-cursor="hover"
            aria-label="Send"
            className="flex h-8 w-8 items-center justify-center rounded-md bg-synapse-1 text-void disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </form>
      </div>
    </Section>
  );
}
