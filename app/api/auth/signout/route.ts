import { NextRequest, NextResponse } from "next/server";
import { invalidateTokenCache } from "@/lib/social-auth";

export async function POST(req: NextRequest) {
  // Drop the server-side token cache (L1 in-process + L2 Redis) for this access
  // token so a signed-out token is no longer honored for the rest of its cache
  // TTL. Best-effort: the client sends its Bearer token; if absent we still clear
  // the refresh cookie below.
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token) invalidateTokenCache(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("qf_refresh_token");
  return response;
}
