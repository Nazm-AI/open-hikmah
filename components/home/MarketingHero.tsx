import Link from "next/link";
import { VerseOfDayStrip } from "@/components/today/VerseOfDayStrip";
import { buttonVariants } from "@/components/ui/Button";
import { JOURNEYS } from "@/lib/journeys";
import type { Verse } from "@/types/quran";

/**
 * The signed-out landing: a single value statement, two clear actions, one-tap
 * journeys, and the Verse of the Day strip. Shown to first-time and logged-out
 * visitors (and rendered server-side, so it is the SEO/first-paint default).
 */
export function MarketingHero({ verse }: { verse: Verse | null }) {
  return (
    <main className="mx-auto flex w-full min-h-0 max-w-[1180px] flex-1 flex-col px-6 md:px-12">
      <div className="flex flex-1 flex-col justify-center py-10">
        <h1 className="max-w-[16ch] text-[clamp(1.85rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-text-primary">
          Explore the Qur&apos;an as a <span className="text-gold">connected graph</span>.
        </h1>
        <p className="mt-4 max-w-[52ch] text-[18px] leading-relaxed text-text-secondary">
          Search any verse and map its connections — shared roots, themes, and contrasts —
          grounded in canonical data, not guessed by AI.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/canvas" className={`${buttonVariants({ variant: "primary", size: "lg" })} w-full sm:w-auto`}>
            Open the canvas
          </Link>
          <Link href="/names" className={`${buttonVariants({ variant: "secondary", size: "lg" })} w-full sm:w-auto`}>
            Browse the Asma&apos;ul Husna
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <span className="mr-1 text-[13px] text-text-muted">Begin with</span>
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

      {verse && (
        <div className="shrink-0 pb-6">
          <VerseOfDayStrip verse={verse} />
        </div>
      )}
    </main>
  );
}
