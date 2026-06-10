"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Network, FolderOpen, Heart, BookOpen, Flame, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useSocialStore } from "@/store/social";
import { Card } from "@/components/ui";
import { VerseOfDayCard } from "@/components/today/VerseOfDayCard";
import { CanvasPreview } from "./CanvasPreview";
import { CANVAS_STORAGE_KEY } from "@/hooks/useCanvasPersistence";
import { JOURNEYS } from "@/lib/journeys";
import type { Verse } from "@/types/quran";
import type { SavedCanvas } from "@/store/canvas";

export function PersonalHome({ verse }: { verse: Verse | null }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const bookmarks = useAuthStore((s) => s.bookmarks);
  const username = useSocialStore((s) => s.username);
  const streak = useSocialStore((s) => s.streak);

  const [continueCount, setContinueCount] = useState<number | null>(null);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CANVAS_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as SavedCanvas;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved?.v === 1) setContinueCount(saved.nodes.length);
    } catch {
      // Corrupt storage — leave null.
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    fetch("/api/workspace", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((ws: unknown[]) => setSavedCount(Array.isArray(ws) ? ws.length : 0))
      .catch(() => {});
  }, [accessToken]);

  const hasContinue = continueCount !== null && continueCount > 0;
  const recentBookmarks = bookmarks.slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-[1180px] flex-1 px-6 py-10 md:px-12">
      <div className="flex gap-10 xl:gap-12">
        {/* ── Left column ── */}
        <div className="min-w-0 flex-1">
          {/* Greeting */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-text-muted">
                Assalamu alaykum
              </p>
              <h1 className="mt-2 text-balance text-[clamp(1.6rem,4vw,2.4rem)] font-semibold tracking-[-0.02em] text-text-primary">
                Welcome back{username ? ", " : ""}
                {username && <span className="text-gold">{username}</span>}
              </h1>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/[0.08] px-3.5 py-1.5 text-gold">
                <Flame className="h-4 w-4" fill="currentColor" />
                <span className="text-sm font-semibold">{streak}-day streak</span>
              </div>
            )}
          </div>

          {/* Quick entry cards */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link href="/canvas" className="block h-full">
              <Card interactive className="flex h-full flex-col gap-2 p-5">
                <Network className="h-5 w-5 text-teal" />
                <p className="text-sm font-medium text-text-primary">
                  {hasContinue ? "Continue your canvas" : "Open the canvas"}
                </p>
                <p className="text-xs text-text-muted">
                  {hasContinue
                    ? `${continueCount} verse${continueCount === 1 ? "" : "s"} in progress`
                    : "Start mapping connections"}
                </p>
              </Card>
            </Link>

            <Link href="/workspaces" className="block h-full">
              <Card interactive className="flex h-full flex-col gap-2 p-5">
                <FolderOpen className="h-5 w-5 text-gold" />
                <p className="text-sm font-medium text-text-primary">Saved canvases</p>
                <p className="text-xs text-text-muted">
                  {savedCount === null ? "View your library" : savedCount === 0 ? "None saved yet" : `${savedCount} saved`}
                </p>
              </Card>
            </Link>

            <Link href="/bookmarks" className="block h-full">
              <Card interactive className="flex h-full flex-col gap-2 p-5">
                <Heart className="h-5 w-5 text-gold" />
                <p className="text-sm font-medium text-text-primary">Bookmarks</p>
                <p className="text-xs text-text-muted">
                  {bookmarks.length > 0 ? `${bookmarks.length} saved` : "Saved verses"}
                </p>
              </Card>
            </Link>

            <Link href="/names" className="block h-full">
              <Card interactive className="flex h-full flex-col gap-2 p-5">
                <BookOpen className="h-5 w-5 text-teal" />
                <p className="text-sm font-medium text-text-primary">The 99 Names</p>
                <p className="text-xs text-text-muted">Asma&apos;ul Husna</p>
              </Card>
            </Link>
          </div>

          {/* Recent bookmarks strip */}
          {recentBookmarks.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">Recent bookmarks</span>
                <Link href="/bookmarks" className="text-xs text-text-muted transition-colors hover:text-gold">
                  View all
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentBookmarks.map((ref) => (
                  <Link
                    key={ref}
                    href={`/canvas?verse=${ref}`}
                    className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:border-gold-muted hover:text-gold"
                  >
                    {ref}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Journeys */}
          <div className="mt-10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <h2 className="text-sm font-medium text-text-primary">Begin a journey</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {JOURNEYS.map((j) => (
                <Link
                  key={j.ref}
                  href={`/canvas?verse=${j.ref}`}
                  className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-text-primary transition-[color,border-color] duration-[120ms] hover:border-gold-muted hover:text-gold"
                >
                  {j.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Verse of Day — shown below journeys on mobile (right col handles xl+) */}
          {verse && (
            <div className="mt-10 xl:hidden">
              <VerseOfDayCard verse={verse} />
            </div>
          )}
        </div>

        {/* ── Right column (xl+) ── */}
        <div className="hidden w-[340px] shrink-0 xl:block">
          {/* Decorative canvas preview */}
          <div className="relative h-[200px] w-full overflow-hidden rounded-xl border border-border opacity-60">
            <CanvasPreview />
          </div>

          {/* Verse of Day */}
          {verse && (
            <div className="mt-6">
              <VerseOfDayCard verse={verse} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
