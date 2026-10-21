"use client";

import { useEffect } from "react";
import type { Domaine } from "@/lib/types";

type VigneronOverlayProps = {
  domaine: Domaine;
  onClose: () => void;
  onOpenFiche: (slug: string) => void;
};

function truncatedDescription(description: string | null) {
  if (!description) return null;
  if (description.length <= 120) return description;
  return `${description.substring(0, 120)}...`;
}

export function VigneronOverlay({
  domaine,
  onClose,
  onOpenFiche,
}: VigneronOverlayProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const appellations = domaine.appellations.map((item) => item.nom);
  const summary = truncatedDescription(domaine.description);

  return (
    <div
      className="absolute inset-0 z-[2000] flex items-center justify-center bg-[#2c322c]/45 p-3 sm:p-4"
      onClick={onClose}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="vigneron-overlay-title"
        className="relative w-full max-w-[24rem] rounded-2xl bg-white p-4 shadow-[0_24px_60px_rgba(44,50,44,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-lg text-stone-400 hover:text-stone-700"
          aria-label="Fermer"
        >
          ×
        </button>

        <h2
          id="vigneron-overlay-title"
          className="pr-9 text-2xl font-bold leading-tight text-[#4A7C59]"
        >
          {domaine.nom}
        </h2>
        {domaine.ville ? (
          <p className="mt-1 text-sm text-stone-500">{domaine.ville}</p>
        ) : null}

        {appellations.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {appellations.map((nom) => (
              <li
                key={nom}
                className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800"
              >
                {nom}
              </li>
            ))}
          </ul>
        ) : null}

        {summary ? (
          <p className="mt-3 text-sm leading-6 text-stone-600">{summary}</p>
        ) : null}

        <button
          type="button"
          onClick={() => onOpenFiche(domaine.slug)}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#4A7C59] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3d6b4c]"
        >
          Voir la fiche complète →
        </button>
      </article>
    </div>
  );
}
