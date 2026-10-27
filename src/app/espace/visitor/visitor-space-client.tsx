"use client";

import { useEffect, useState } from "react";
import { getUserProfile, type UserProfile } from "@/lib/services/auth";

export function VisitorSpaceClient() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getUserProfile().then((data) => {
      if (!isMounted) return;
      setProfile(data);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-[0.16em] text-[#8b9288]">
        Compte
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[#2c322c]">
        Mon espace utilisateur
      </h1>
      <p className="mt-2 text-sm text-[#5c5146]">
        Retrouvez ici votre identifiant et les prochaines fonctionnalités.
      </p>

      <section className="mt-8 rounded-2xl border border-[#e4d9c8] bg-[#fffdf8] p-6 shadow-[0_16px_40px_rgba(44,50,44,0.06)]">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#2c322c]">
          Identifiant unique
        </h2>
        {isLoading ? (
          <p className="mt-3 text-sm text-[#8b9288]">Chargement…</p>
        ) : (
          <p className="mt-3 font-mono text-sm tracking-wide text-[#2c322c]">
            {profile?.unique_id ?? "—"}
          </p>
        )}
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-[#e4d9c8] bg-[#fffdf8] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[#2c322c]">
            Favoris
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#8b9288]">
            Bientôt disponible.
          </p>
        </section>
        <section className="rounded-2xl border border-[#e4d9c8] bg-[#fffdf8] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[#2c322c]">
            Historique
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#8b9288]">
            Bientôt disponible.
          </p>
        </section>
      </div>
    </main>
  );
}
