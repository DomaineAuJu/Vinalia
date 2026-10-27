import type { SupabaseClient } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  email: string | null;
  nom: string | null;
  siret: string | null;
  role: string;
  unique_id: string | null;
  created_at: string;
};

function metadataString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export async function getUserProfile(
  supabase: SupabaseClient,
): Promise<UserProfile | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const uniqueId = metadataString(user.user_metadata?.unique_id);
  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, nom, siret, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !data) {
    return null;
  }

  return {
    ...(data as Omit<UserProfile, "unique_id">),
    unique_id: uniqueId,
  };
}
