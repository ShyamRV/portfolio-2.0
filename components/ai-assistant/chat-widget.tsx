"use client";

import * as React from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatBubble, type ChatTurn } from "./chat-bubble";

function getSessionId(): string {
  const KEY = "portfolio-chat-session";
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

const INTRO: ChatTurn = {
  role: "assistant",
  text:
    "Ask me about this portfolio. I only answer from real site content and cite my sources — if I don't have it, I'll say so.",
};

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [turns, setTurns] = React.useState<ChatTurn[]>([INTRO]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns, open]);

  async function send() {
    const message = input.trim();
    if (!message || busy) return;
    setInput("");
    setBusy(true);
    setTurns((t) => [...t, { role: "user", text: message }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId: getSessionId() }),
      });
      const data = (await res.json()) as {
        answer?: string;
        citations?: { sourceUrl: string }[];
        grounded?: boolean;
        error?: string;
      };
      setTurns((t) => [
        ...t,
        {
          role: "assistant",
          text: data.answer ?? data.error ?? "Something went wrong.",
          citations: data.citations,
          grounded: data.grounded,
        },
      ]);
    } catch {
      setTurns((t) => [
        ...t,
        {
          role: "assistant",
          text: "The assistant is unavailable right now. Please try again shortly.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        size="icon"
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 size-12 rounded-full shadow-lg"
      >
        {open ? <X /> : <MessageCircle />}
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-label="Portfolio assistant"
          className={cn(
            "glass fixed bottom-20 right-5 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl shadow-2xl",
            "motion-safe:animate-fade-in",
          )}
        >
          <header className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Portfolio assistant</p>
            <p className="text-xs text-muted-foreground">
              Grounded answers with citations · powered by a free model
            </p>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {turns.map((turn, i) => (
              <ChatBubble key={i} turn={turn} />
            ))}
            {busy ? (
              <p className="text-xs text-muted-foreground">Thinking…</p>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this portfolio…"
              aria-label="Message"
              maxLength={1000}
              className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" size="icon" disabled={busy || !input.trim()}>
              <Send />
            </Button>
          </form>
        </div>
      ) : null}
    </>
  );
}
