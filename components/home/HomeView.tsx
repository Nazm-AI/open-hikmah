"use client";

import { useAuthStore } from "@/store/auth";
import { MarketingHero } from "./MarketingHero";
import { PersonalHome } from "./PersonalHome";
import { AuthLoadingSkeleton } from "./AuthLoadingSkeleton";
import type { Verse } from "@/types/quran";

export function HomeView({ verse }: { verse: Verse | null }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isSessionLoading = useAuthStore((s) => s.isSessionLoading);

  // While the session is restoring, show a skeleton that matches PersonalHome's
  // layout. Without this, signed-in users briefly see the MarketingHero on every
  // reload, which also briefly exposes the "Sign in" button to signed-in users.
  if (isSessionLoading && !accessToken) {
    return <AuthLoadingSkeleton />;
  }

  return accessToken ? <PersonalHome verse={verse} /> : <MarketingHero verse={verse} />;
}
