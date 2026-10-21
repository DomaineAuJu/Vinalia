import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center px-4 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#2c322c]">
        Page introuvable
      </h1>
      <p className="mt-3 text-[#5c5146]">
        Ce lien ne correspond à aucun domaine publié sur Vinalia.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm text-[var(--forest)] underline-offset-4 hover:underline"
      >
        Retour à la carte
      </Link>
    </main>
  );
}
