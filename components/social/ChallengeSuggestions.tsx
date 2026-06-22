"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui";

export interface Suggestion {
  id: number;
  title: string;
  description: string | null;
  verseRef: string | null;
  suggestedDuration: string | null;
}

interface Props {
  suggestions: Suggestion[];
  onPick: (s: Suggestion) => void;
}

/**
 * Admin-curated challenge ideas. Picking one seeds the create form below (passes
 * verse/duration/suggestionId). Renders nothing when there are no active
 * suggestions, so it stays invisible until the admin curates some.
 */
export function ChallengeSuggestions({ suggestions, onPick }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
        <Sparkles className="h-3.5 w-3.5 text-teal" />
        Suggested challenges
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((s) => (
          <div key={s.id} className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-text-primary">{s.title}</span>
                {s.suggestedDuration && (
                  <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                    {s.suggestedDuration}
                  </span>
                )}
              </div>
              {s.description && <p className="text-xs leading-relaxed text-text-muted">{s.description}</p>}
              {s.verseRef && <p className="font-mono text-[11px] text-teal">{s.verseRef}</p>}
            </div>
            <Button variant="secondary" size="sm" onClick={() => onPick(s)} className="self-start">
              Challenge a friend
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
