import { NextResponse } from "next/server";
import { getUserProfile } from "@/lib/services/user-profile";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/login", requestUrl.origin));
    }
  }

  const supabase = await createServerSupabase();
  const profile = await getUserProfile(supabase);

  if (!profile) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const role = profile.role === "pro" ? "pro" : "visitor";
  const fallback = role === "pro" ? "/espace/pro" : "/espace/visitor";
  const destination =
    next &&
    next.startsWith("/espace/") &&
    (role === "pro" || !next.startsWith("/espace/pro"))
      ? next
      : fallback;

  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
