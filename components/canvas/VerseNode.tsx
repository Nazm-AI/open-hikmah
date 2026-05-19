"use client";

import { memo, useEffect } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { Verse, EdgeKind } from "@/types/quran";
import { useCanvasStore } from "@/store/canvas";
import { cn } from "@/lib/utils";
import { Loader2, Plus } from "lucide-react";
import { ExpandMenu } from "./ExpandMenu";

type VerseNodeData = Verse & { isRoot?: boolean; isLoading?: boolean };

function VerseNodeInner({ id, data, selected }: NodeProps) {
  const verse = data as unknown as VerseNodeData;

  const expandingNodeId = useCanvasStore((s) => s.expandingNodeId);
  const openExpandNodeId = useCanvasStore((s) => s.openExpandNodeId);
  const setSelectedNode = useCanvasStore((s) => s.setSelectedNode);
  const setOpenExpandNodeId = useCanvasStore((s) => s.setOpenExpandNodeId);
  const setSidebarContent = useCanvasStore((s) => s.setSidebarContent);
  const setPendingExpand = useCanvasStore((s) => s.setPendingExpand);

  const isExpanding = expandingNodeId === id;
  const expandMenuOpen = openExpandNodeId === id;

  // Open sidebar when this node is selected
  useEffect(() => {
    if (selected) {
      setSidebarContent({ type: "node", verse: verse as Verse });
    }
    // Sidebar is closed explicitly via its X button, not here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleExpandSelect = (kind: EdgeKind) => {
    setPendingExpand({ nodeId: id, ref: verse.ref, kind });
  };

  return (
    <div
      onClick={() => setSelectedNode(selected ? null : id)}
      className={cn(
        "relative w-72 rounded-xl border transition-all duration-300 cursor-pointer select-none",
        "bg-[var(--color-surface-raised)] border-[var(--color-border)]",
        selected && "border-[var(--color-gold)] gold-glow",
        isExpanding && "border-[var(--color-teal)] teal-glow",
        !selected &&
          !isExpanding &&
          "hover:border-[var(--color-border)] hover:brightness-110"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-[var(--color-border)] !border-[var(--color-border-subtle)]"
      />

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono tracking-wider uppercase" style={{ color: "var(--color-text-muted)" }}>
            {verse.surahName}
          </span>
          <span
            className={cn(
              "text-xs font-mono px-2 py-0.5 rounded-full border",
              verse.isRoot
                ? "border-opacity-40 bg-opacity-10"
                : ""
            )}
            style={
              verse.isRoot
                ? {
                    color: "var(--color-gold)",
                    borderColor: "var(--color-gold)",
                    background: "rgba(201,168,76,0.1)",
                  }
                : {
                    color: "var(--color-text-muted)",
                    borderColor: "var(--color-border)",
                  }
            }
          >
            {verse.ref}
          </span>
        </div>

        <p
          className="font-arabic text-right text-base leading-loose"
          style={{ color: "var(--color-text-primary)" }}
        >
          {verse.arabicText}
        </p>

        <p
          className="text-xs leading-relaxed line-clamp-3"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {verse.translation}
        </p>
      </div>

      {/* Expand button */}
      <div
        className="flex justify-center pb-3"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setOpenExpandNodeId(expandMenuOpen ? null : id);
          }}
          disabled={isExpanding}
          className={cn(
            "w-7 h-7 rounded-full border flex items-center justify-center transition-all",
            expandMenuOpen
              ? "border-teal-500 text-teal-400 bg-teal-900/20"
              : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-teal-600 hover:text-teal-400",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title="Expand connections"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {expandMenuOpen && (
        <ExpandMenu
          onSelect={handleExpandSelect}
          onClose={() => setOpenExpandNodeId(null)}
        />
      )}

      {isExpanding && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[var(--color-surface-raised)]/60 backdrop-blur-sm">
          <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-[var(--color-border)] !border-[var(--color-border-subtle)]"
      />
    </div>
  );
}

export const VerseNode = memo(VerseNodeInner);
