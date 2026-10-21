import Link from "next/link";
import type { Domaine } from "@/lib/types";

type DomaineCardProps = {
  domaine: Domaine;
};

export function DomaineCard({ domaine }: DomaineCardProps) {
  const appellationLabel = domaine.appellations
    .map((appellation) => appellation.nom)
    .slice(0, 3)
    .join(" · ");

  return (
    <article
      id={`domaine-${domaine.id}`}
      className="rounded-2xl border border-[#e4e0d6] bg-white p-4 transition hover:border-[var(--forest)]"
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-[#8b9288]">
        {domaine.ville ?? "Loire"}
        {domaine.code_postal ? ` · ${domaine.code_postal}` : ""}
      </p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-[#2c322c]">
        {domaine.nom}
      </h2>
      {appellationLabel ? (
        <p className="mt-2 text-sm text-[#6d746c]">{appellationLabel}</p>
      ) : null}
      <Link
        href={`/domaines/${domaine.slug}`}
        className="mt-3 inline-flex text-sm font-medium text-[var(--forest)] underline-offset-4 hover:underline"
      >
        Voir la fiche
      </Link>
    </article>
  );
}
