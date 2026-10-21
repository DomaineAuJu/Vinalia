import { createClient } from "@supabase/supabase-js";

function getSupabaseConfig() {
  // 1. On récupère les variables
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 2. On nettoie TOUT : espaces avant/après et slash à la fin
  const url = rawUrl?.trim().replace(/\/$/, "");
  const anonKey = rawKey?.trim();

  if (!url || !anonKey) {
    throw new Error(
      "Variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY requises.",
    );
  }

  return { url, anonKey };
}

export function createSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createClient(url, anonKey);
}