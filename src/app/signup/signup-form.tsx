"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp, spacePathForRole, type UserRole } from "@/lib/services/auth";

const fieldClassName =
  "mt-1.5 h-11 w-full rounded-xl border border-[#e4d9c8] bg-white px-3 text-sm text-[#2c322c] outline-none placeholder:text-[#b4b9b1] focus:border-[#3e5c45]";

type SignupFormProps = {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
};

export function SignupForm({ role, onRoleChange }: SignupFormProps) {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [siret, setSiret] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const result = await signUp(email, password, {
      role,
      confirmPassword,
      nom: role === "pro" ? nom : undefined,
      siret: role === "pro" ? siret : undefined,
    });

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
      <div
        role="group"
        aria-label="Type de compte"
        className="grid grid-cols-2 rounded-xl border border-[#e4d9c8] bg-white p-1"
      >
        <button
          type="button"
          aria-pressed={role === "pro"}
          onClick={() => onRoleChange("pro")}
          className={`rounded-lg px-3 py-2.5 text-sm ${
            role === "pro"
              ? "bg-[#3e5c45] text-white"
              : "text-[#5c5146] hover:bg-[#f6f3ec]"
          }`}
        >
          Je suis vigneron
        </button>
        <button
          type="button"
          aria-pressed={role === "visitor"}
          onClick={() => onRoleChange("visitor")}
          className={`rounded-lg px-3 py-2.5 text-sm ${
            role === "visitor"
              ? "bg-[#3e5c45] text-white"
              : "text-[#5c5146] hover:bg-[#f6f3ec]"
          }`}
        >
          Je suis utilisateur
        </button>
      </div>

      {role === "pro" ? (
        <label className="block" htmlFor="signup-nom">
          <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
            Nom
          </span>
          <input
            id="signup-nom"
            name="nom"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            value={nom}
            onChange={(event) => setNom(event.target.value)}
            aria-invalid={Boolean(errorMessage)}
            placeholder="Votre nom"
            className={fieldClassName}
          />
        </label>
      ) : null}

      <label className="block" htmlFor="signup-email">
        <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
          E-mail
        </span>
        <input
          id="signup-email"
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

      {role === "pro" ? (
        <label className="block" htmlFor="signup-siret">
          <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
            Numéro SIRET
          </span>
          <input
            id="signup-siret"
            name="siret"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            minLength={14}
            maxLength={14}
            value={siret}
            onChange={(event) => setSiret(event.target.value)}
            placeholder="14 chiffres"
            className={fieldClassName}
          />
        </label>
      ) : null}

      <label className="block" htmlFor="signup-password">
        <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
          Mot de passe
        </span>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errorMessage)}
          placeholder="8 caractères minimum"
          className={fieldClassName}
        />
      </label>

      <label className="block" htmlFor="signup-confirm-password">
        <span className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
          Confirmation
        </span>
        <input
          id="signup-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          aria-invalid={Boolean(errorMessage)}
          placeholder="Répétez le mot de passe"
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
            Création du compte…
          </>
        ) : (
          "Créer mon compte"
        )}
      </button>

      <p className="text-center text-sm text-[#5c5146]">
        Déjà inscrit ?{" "}
        <Link href="/login" className="text-[#3e5c45] underline-offset-4 hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
