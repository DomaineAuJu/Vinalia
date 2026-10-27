"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import {
  getUserProfile as fetchUserProfile,
  type UserProfile,
} from "@/lib/services/user-profile";

export type UserRole = "pro" | "visitor";

export type { UserProfile };

export type AuthProviderSuccess = {
  ok: true;
  role: UserRole;
};

export type AuthProviderFailure = {
  ok: false;
  message: string;
};

export type AuthProviderResult = AuthProviderSuccess | AuthProviderFailure;

export type CreateUserInput = {
  email: string;
  password: string;
  uniqueId: string;
  nom?: string;
  siret?: string;
};

const SIGN_IN_GENERIC_ERROR = "Identifiants incorrects.";

function signUpErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "Impossible de créer le compte. Réessayez.";
  }
  if (normalized.includes("password")) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  if (normalized.includes("rate limit") || normalized.includes("over_email")) {
    return "Trop de demandes. Réessayez dans quelques minutes.";
  }
  return "Impossible de créer le compte. Réessayez.";
}

function signInErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("rate limit") || normalized.includes("over_email")) {
    return "Trop de demandes. Réessayez dans quelques minutes.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Confirmez votre e-mail avant de vous connecter.";
  }
  return SIGN_IN_GENERIC_ERROR;
}

function roleFromSiret(siret?: string): UserRole {
  return siret && /^\d{14}$/.test(siret) ? "pro" : "visitor";
}

async function profileRole(
  supabase: ReturnType<typeof createBrowserSupabase>,
  userId: string,
): Promise<UserRole> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return data?.role === "pro" ? "pro" : "visitor";
}

export async function createUser(
  input: CreateUserInput,
): Promise<AuthProviderResult> {
  const cleanSiret = input.siret?.replace(/\s/g, "") || undefined;
  const role = roleFromSiret(cleanSiret);
  const nom = role === "pro" ? input.nom : undefined;
  const supabase = createBrowserSupabase();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        nom: nom ?? null,
        siret: role === "pro" ? cleanSiret ?? null : null,
        role,
        unique_id: input.uniqueId,
      },
    },
  });

  if (error) {
    return { ok: false, message: signUpErrorMessage(error.message) };
  }

  const userId = data.user?.id;
  if (userId) {
    await supabase.from("profiles").upsert({
      id: userId,
      email: input.email,
      nom: nom ?? null,
      siret: role === "pro" ? cleanSiret ?? null : null,
      role,
    });
  }

  return { ok: true, role };
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthProviderResult> {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      ok: false,
      message: signInErrorMessage(error?.message ?? "invalid credentials"),
    };
  }

  const role = await profileRole(supabase, data.user.id);
  return { ok: true, role };
}

export async function getUserSession(): Promise<UserProfile | null> {
  const supabase = createBrowserSupabase();
  return fetchUserProfile(supabase);
}

export async function signOutUser(): Promise<AuthProviderResult> {
  const supabase = createBrowserSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { ok: false, message: "La déconnexion a échoué." };
  }
  return { ok: true, role: "visitor" };
}
