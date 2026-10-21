import { createClient } from "@supabase/supabase-js";

function getSupabaseConfig() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const url = rawUrl?.trim().replace(/\/$/, "");
  const anonKey = rawKey?.trim();

  // LE MOUCHARD : Si ça plante, on saura pourquoi
  if (!url || !anonKey) {
    throw new Error(
      `VARIABLES MANQUANTES DANS VERCEL ! 
       URL reçue: "${url}" 
       KEY reçue: "${anonKey ? 'OK' : 'VIDE'}"
       Vérifie les "Project Settings" > "Environments" sur Vercel.`
    );
  }

  // Vérification de format
  if (!url.startsWith('https://')) {
     throw new Error(`URL INVALIDE : "${url}". Elle doit commencer par https://`);
  }

  return { url, anonKey };
}

export function createSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createClient(url, anonKey);
}