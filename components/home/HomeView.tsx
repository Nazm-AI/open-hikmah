"use client";

import { useAuthStore } from "@/store/auth";
import { MarketingHero } from "./MarketingHero";
import { PersonalHome } from "./PersonalHome";
import type { Verse } from "@/types/quran";

/**
 * Adaptive home. Signed-out (and the SSR/first-paint default, since the access
 * token is restored client-side) shows the marketing hero; once a session is
 * present it swaps to the personal home. The Verse of the Day is fetched on the
 * server and threaded through both so neither has to wait on it.
 */
export function HomeView({ verse }: { verse: Verse | null }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return accessToken ? <PersonalHome verse={verse} /> : <MarketingHero verse={verse} />;
}
