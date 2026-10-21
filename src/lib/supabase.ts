import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(raw: string): string {
  let url = raw.trim().replace(/^["']|["']$/g, "").trim();
  url = url.replace(/\/+$/, "");
  url = url.replace(/\/(rest|auth|storage|realtime)\/v1$/i, "");
  return url;
}

function getSupabaseConfig() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const url = rawUrl ? normalizeSupabaseUrl(rawUrl) : "";
  const anonKey = rawKey?.trim();

  if (!url || !anonKey) {
    throw new Error(
      `Variables NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY manquantes dans Vercel.`,
    );
  }

  if (!url.startsWith("https://")) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL invalide (doit commencer par https://).`,
    );
  }

  return { url, anonKey };
}

export function createSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createClient(url, anonKey);
}