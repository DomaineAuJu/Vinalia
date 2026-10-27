"use client";

import {
  authenticateUser,
  createUser,
  getUserSession,
  signOutUser,
  type UserRole,
} from "@/lib/services/providers/supabase-auth";
import { generateUniqueId } from "@/lib/services/user-id";
import { verifySiret } from "@/lib/services/verification";
import {
  signInSchema,
  signUpSchema,
  userSignUpSchema,
} from "@/lib/validators/auth.schema";

export type { UserProfile, UserRole } from "@/lib/services/providers/supabase-auth";

export type AuthSuccess = {
  ok: true;
  role: UserRole;
};

export type AuthFailure = {
  ok: false;
  message: string;
};

export type AuthResult = AuthSuccess | AuthFailure;

export type SignUpOptions = {
  role: UserRole;
  confirmPassword: string;
  nom?: string;
  siret?: string;
};

function firstZodMessage(error: { issues: Array<{ message: string }> }) {
  return error.issues[0]?.message ?? "Formulaire invalide.";
}

export function spacePathForRole(role: string) {
  return role === "pro" ? "/espace/pro" : "/espace/visitor";
}

export async function signUp(
  email: string,
  password: string,
  options: SignUpOptions,
): Promise<AuthResult> {
  const uniqueId = generateUniqueId();

  if (options.role === "visitor") {
    const parsed = userSignUpSchema.safeParse({
      email,
      password,
      confirmPassword: options.confirmPassword,
    });

    if (!parsed.success) {
      return { ok: false, message: firstZodMessage(parsed.error) };
    }

    return createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      uniqueId,
    });
  }

  const parsed = signUpSchema.safeParse({
    email,
    password,
    confirmPassword: options.confirmPassword,
    nom: options.nom ?? "",
    siret: options.siret ?? "",
  });

  if (!parsed.success) {
    return { ok: false, message: firstZodMessage(parsed.error) };
  }

  const verification = await verifySiret(parsed.data.siret);
  if (!verification.isValid) {
    return { ok: false, message: "Le numéro SIRET est invalide." };
  }

  return createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    nom: parsed.data.nom,
    siret: parsed.data.siret,
    uniqueId,
  });
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  const parsed = signInSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { ok: false, message: firstZodMessage(parsed.error) };
  }

  return authenticateUser(parsed.data.email, parsed.data.password);
}

export async function getUserProfile() {
  return getUserSession();
}

export async function signOut(): Promise<AuthResult> {
  return signOutUser();
}
