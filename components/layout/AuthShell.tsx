"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { LandingHeader } from "./LandingHeader";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isSessionLoading = useAuthStore((s) => s.isSessionLoading);

  useEffect(() => {
    if (isSessionLoading) return;
    if (!accessToken) router.replace("/");
  }, [isSessionLoading, accessToken, router]);

  const showContent = !isSessionLoading && accessToken;

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <LandingHeader />
      {showContent ? (
        children
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-teal" />
        </div>
      )}
    </div>
  );
}
