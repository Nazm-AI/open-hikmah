import type { Metadata } from "next";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { HomeView } from "@/components/home/HomeView";
import { getVerseOfDay } from "@/lib/verse-of-day";

export const metadata: Metadata = {
  title: "Open Hikmah — the Qur'an as a connected graph",
  description:
    "Search any verse and map its connections — shared roots, themes, and contrasts — grounded in canonical Qur'an data.",
};

// Render per request so the Verse of the Day matches the current UTC day — and
// the same verse /today (also force-dynamic) links through to. getVerse is a plain
// DB read (no dynamic API), so otherwise this page would prerender at build and
// freeze the verse, diverging from /today.
export const dynamic = "force-dynamic";

export default async function Home() {
  const verse = await getVerseOfDay().catch(() => null);

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <LandingHeader />

      <HomeView verse={verse} />

      <footer className="shrink-0 border-t border-border px-6 py-4 md:px-12">
        <p className="text-[13px] text-text-muted">
          Open Hikmah · Qur&apos;an text &amp; translation from canonical sources.
        </p>
      </footer>
    </div>
  );
}
