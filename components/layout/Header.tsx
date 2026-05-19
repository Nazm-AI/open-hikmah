"use client";

import { BookOpen, Search, Sparkles, RotateCcw } from "lucide-react";
import { useCanvasStore } from "@/store/canvas";

interface HeaderProps {
  onSearchOpen: () => void;
}

export function Header({ onSearchOpen }: HeaderProps) {
  const reset = useCanvasStore((s) => s.reset);
  const nodeCount = useCanvasStore((s) => s.nodes.length);

  return (
    <header
      className="flex items-center justify-between px-5 py-2.5 shrink-0"
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center border"
          style={{
            background: "rgba(201,168,76,0.1)",
            borderColor: "rgba(201,168,76,0.3)",
          }}
        >
          <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--color-gold)" }} />
        </div>
        <span
          className="text-sm font-semibold tracking-wide"
          style={{ color: "var(--color-text-primary)" }}
        >
          Open Hikmah
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {nodeCount > 0 && (
          <>
            <span
              className="text-xs font-mono mr-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              {nodeCount} verse{nodeCount !== 1 ? "s" : ""}
            </span>
            <button
              onClick={reset}
              title="Clear canvas"
              className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all hover:border-red-800 hover:text-red-400"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-muted)",
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd
            className="ml-0.5 text-[10px] font-mono px-1 rounded"
            style={{ color: "var(--color-text-muted)", background: "var(--color-surface-overlay)" }}
          >
            ⌘K
          </kbd>
        </button>

        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs"
          style={{
            color: "var(--color-teal)",
            border: "1px solid rgba(13,148,136,0.3)",
            background: "rgba(13,148,136,0.05)",
          }}
        >
          <Sparkles className="w-3 h-3" />
          <span>AI</span>
        </div>
      </div>
    </header>
  );
}
