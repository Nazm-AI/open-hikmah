"use client";

import { Search, BookOpen } from "lucide-react";

interface EmptyStateProps {
  onSearchOpen: () => void;
}

export function EmptyState({ onSearchOpen }: EmptyStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="text-center max-w-xs pointer-events-auto">
        {/* Icon */}
        <div className="relative mx-auto mb-7 w-16 h-16">
          <div
            className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
            style={{ background: "var(--color-gold)" }}
          />
          <div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center border"
            style={{
              background: "rgba(201,168,76,0.08)",
              borderColor: "rgba(201,168,76,0.25)",
            }}
          >
            <BookOpen className="w-7 h-7" style={{ color: "var(--color-gold)" }} />
          </div>
        </div>

        <h2
          className="text-lg font-semibold tracking-tight mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Begin Your Journey
        </h2>
        <p
          className="text-sm leading-relaxed mb-7"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Search a verse or theme. Claude discovers semantic connections
          across the Quran, weaving a living map of divine wisdom.
        </p>

        <button
          onClick={onSearchOpen}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-110 active:scale-[0.97]"
          style={{
            background: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.35)",
            color: "var(--color-gold)",
          }}
        >
          <Search className="w-4 h-4" />
          Search verses
          <kbd
            className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{
              color: "var(--color-text-muted)",
              background: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Legend */}
        <div
          className="mt-8 flex items-center justify-center gap-5 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {[
            { color: "var(--color-theme-edge)", label: "Thematic" },
            { color: "var(--color-root-edge)", label: "Root word" },
            { color: "var(--color-contrast-edge)", label: "Contrast" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className="w-4 h-px rounded-full"
                style={{ background: item.color, opacity: 0.8 }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
