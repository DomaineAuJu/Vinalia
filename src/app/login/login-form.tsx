"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, spacePathForRole } from "@/lib/services/auth";

const fieldClassName =
  "mt-1.5 h-11 w-full rounded-xl border border-[#e4d9c8] bg-white px-3 text-sm text-[#2c322c] outline-none placeholder:text-[#b4b9b1] focus:border-[#3e5c45]";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const result = await signIn(email, password);
    if (!result.ok) {
      setErrorMessage(result.message);
      setIsLoading(false);
      return;
    }

    router.push(spacePathForRole(result.role));
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
      <label className="block" htmlFor="login-email">
        <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
          E-mail
        </span>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errorMessage)}
          placeholder="vous@domaine.fr"
          className={fieldClassName}
        />
      </label>

      <label className="block" htmlFor="login-password">
        <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
          Mot de passe
        </span>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errorMessage)}
          placeholder="Votre mot de passe"
          className={fieldClassName}
        />
      </label>

      {errorMessage ? (
        <p className="text-sm text-red-800" role="alert" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3e5c45] text-sm font-medium text-white hover:bg-[#2f4a38] disabled:cursor-wait disabled:opacity-80"
      >
        {isLoading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden
            />
            Connexion…
          </>
        ) : (
          "Se connecter"
        )}
      </button>

      <p className="text-center text-sm text-[#5c5146]">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="text-[#3e5c45] underline-offset-4 hover:underline">
          S’inscrire
        </Link>
      </p>
    </form>
  );
}
