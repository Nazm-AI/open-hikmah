"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useSocialStore } from "@/store/social";
import { Loader2, Trophy, Clock, Minus, Swords } from "lucide-react";
import { Card, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface EnrichedChallenge {
  id: number;
  challengerId: number;
  challengedId: number;
  challengerUsername: string | null;
  challengedUsername: string | null;
  verseRef: string | null;
  status: string;
  startsAt: string;
  endsAt: string;
  winnerId: number | null;
  challengerScore: number;
  challengedScore: number;
}

interface Props {
  challenges: EnrichedChallenge[];
  onUpdate: () => void;
}

function formatCountdown(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const totalSec = Math.floor(diff / 1000);
  const d = Math.floor(totalSec / 86_400);
  const h = Math.floor((totalSec % 86_400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m ${s}s left`;
}

/**
 * Live countdown that self-adjusts: ticks every second in the final hour (so it
 * feels alive) and every 30s before that (to avoid needless re-renders on long
 * 7-day windows). State only updates inside the timeout callback, never
 * synchronously in the effect body.
 */
function useCountdown(endsAt: string): string {
  const [label, setLabel] = useState(() => formatCountdown(endsAt));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) return;
      timer = setTimeout(() => {
        setLabel(formatCountdown(endsAt));
        schedule();
      }, diff < 3_600_000 ? 1000 : 30_000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [endsAt]);

  return label;
}

function StatusBadge({ label, tone }: { label: string; tone: "active" | "gold" | "draw" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide",
        tone === "active" && "border-teal/40 bg-teal/10 text-teal",
        tone === "gold" && "border-gold-muted bg-gold/10 text-gold",
        tone === "draw" && "border-teal/30 bg-teal/5 text-text-secondary",
        tone === "muted" && "border-border bg-white/5 text-text-muted"
      )}
    >
      {label}
    </span>
  );
}

function ChallengeCard({
  c,
  myId,
  onUpdate,
}: {
  c: EnrichedChallenge;
  myId: number;
  onUpdate: () => void;
}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [acting, setActing] = useState<"accept" | "decline" | "cancel" | null>(null);
  const countdown = useCountdown(c.endsAt);
  const isChallenger = c.challengerId === myId;
  const myScore = isChallenger ? c.challengerScore : c.challengedScore;
  const theirScore = isChallenger ? c.challengedScore : c.challengerScore;
  const opponentName = isChallenger ? c.challengedUsername : c.challengerUsername;
  const iWon = c.winnerId === myId;
  const theyWon = c.winnerId !== null && c.winnerId !== myId;
  const isDraw = c.status === "completed" && c.winnerId === null;

  const handleAction = async (action: "accept" | "decline" | "cancel") => {
    if (!accessToken) return;
    setActing(action);
    try {
      await fetch(`/api/social/challenges/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ action }),
      });
      onUpdate();
    } finally {
      setActing(null);
    }
  };

  const borderClass =
    c.status === "completed" && iWon ? "border-gold"
    : c.status === "active" ? "border-teal"
    : "border-border";

  return (
    <Card
      className={cn(
        "space-y-2 p-4",
        borderClass,
        (c.status === "declined" || c.status === "cancelled") && "opacity-60"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-text-primary">vs @{opponentName}</span>
        {c.status === "active" ? <StatusBadge label="Active" tone="active" />
          : c.status === "pending" && !isChallenger ? <StatusBadge label="Incoming" tone="gold" />
          : c.status === "pending" ? <StatusBadge label="Pending" tone="muted" />
          : iWon ? <StatusBadge label="Won" tone="gold" />
          : isDraw ? <StatusBadge label="Draw" tone="draw" />
          : theyWon ? <StatusBadge label="Lost" tone="muted" />
          : c.status === "cancelled" ? <StatusBadge label="Cancelled" tone="muted" />
          : <StatusBadge label="Declined" tone="muted" />}
      </div>

      {c.verseRef && <p className="font-mono text-xs text-teal">{c.verseRef}</p>}

      {(c.status === "active" || c.status === "completed") && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm tabular-nums text-text-secondary">
            You <span className={cn("font-semibold", myScore >= theirScore && "text-text-primary")}>{myScore}</span>
            {" — "}
            <span className="font-semibold">{theirScore}</span> @{opponentName}
          </span>
          {c.status === "active" && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Clock className="h-3 w-3" />
              {countdown}
            </span>
          )}
          {iWon && <Trophy className="h-3.5 w-3.5 text-gold" />}
          {isDraw && <Minus className="h-3.5 w-3.5 text-text-muted" />}
        </div>
      )}

      {c.status === "pending" && isChallenger && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-text-muted">Waiting for @{opponentName} to respond…</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction("cancel")}
            disabled={acting !== null}
            className="gap-1 text-text-muted hover:text-error"
          >
            {acting === "cancel" && <Loader2 className="h-3 w-3 animate-spin" />}
            Cancel
          </Button>
        </div>
      )}

      {c.status === "pending" && !isChallenger && (
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => handleAction("accept")} disabled={acting !== null} className="gap-1">
            {acting === "accept" && <Loader2 className="h-3 w-3 animate-spin" />}
            <Swords className="h-3.5 w-3.5" />
            Accept
          </Button>
          <Button variant="secondary" size="sm" onClick={() => handleAction("decline")} disabled={acting !== null} className="gap-1">
            {acting === "decline" && <Loader2 className="h-3 w-3 animate-spin" />}
            Decline
          </Button>
        </div>
      )}
    </Card>
  );
}

export function ChallengeList({ challenges, onUpdate }: Props) {
  const myId = useSocialStore((s) => s.userId);

  if (!myId) return null;

  if (challenges.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <Swords className="mx-auto mb-2 h-5 w-5 text-text-muted" />
        <p className="text-sm text-text-secondary">No challenges yet.</p>
        <p className="text-xs text-text-muted">Pick a suggestion above or challenge a friend.</p>
      </div>
    );
  }

  const order = ["active", "pending", "completed", "declined", "cancelled"];
  const sorted = [...challenges].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));

  return (
    <div className="space-y-2">
      {sorted.map((c) => (
        <ChallengeCard key={c.id} c={c} myId={myId} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
