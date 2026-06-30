import { cn } from "@/lib/utils";
import { CitationPill } from "./citation-pill";

export type ChatTurn = {
  role: "user" | "assistant";
  text: string;
  citations?: { sourceUrl: string }[];
  grounded?: boolean;
};

export function ChatBubble({ turn }: { turn: ChatTurn }) {
  const isUser = turn.role === "user";
  const uniqueSources = Array.from(
    new Set((turn.citations ?? []).map((c) => c.sourceUrl)),
  );

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{turn.text}</p>
        {!isUser && uniqueSources.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border/60 pt-2">
            {uniqueSources.map((url) => (
              <CitationPill key={url} url={url} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
