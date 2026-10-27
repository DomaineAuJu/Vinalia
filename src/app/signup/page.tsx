"use client";

import { useState } from "react";
import { SignupForm } from "@/app/signup/signup-form";
import type { UserRole } from "@/lib/services/auth";

export default function SignupPage() {
  const [role, setRole] = useState<UserRole>("pro");

  return (
    <main className="flex flex-1 items-center justify-center bg-stone-50 px-4 py-16">
      <section className="w-full max-w-md rounded-2xl border border-[#e4d9c8] bg-[#fffdf8] p-8 shadow-[0_16px_40px_rgba(44,50,44,0.08)]">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8b9288]">
          Inscription
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#2c322c]">
          Créer un compte {role === "pro" ? "Vigneron" : "Utilisateur"}
        </h1>
        <SignupForm role={role} onRoleChange={setRole} />
      </section>
    </main>
  );
}
