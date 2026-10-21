import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bottleImageForCouleur } from "@/lib/couleurs-ui";
import { getDomaineBySlug } from "@/lib/domaines";
import type { Cuvee } from "@/lib/types";

export const dynamic = "force-dynamic";

type DomainePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DomainePageProps) {
  const { slug } = await params;
  const domaine = await getDomaineBySlug(slug);
  if (!domaine) {
    return { title: "Domaine introuvable" };
  }
  return {
    title: domaine.nom,
    description:
      domaine.description ??
      `Fiche du domaine ${domaine.nom}${domaine.ville ? ` à ${domaine.ville}` : ""}.`,
  };
}

function formatWebsite(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function groupCuveesByCouleur(cuvees: Cuvee[]) {
  const groups = new Map<string, Cuvee[]>();
  const withoutColor: Cuvee[] = [];

  for (const cuvee of cuvees) {
    if (cuvee.couleurs.length === 0) {
      withoutColor.push(cuvee);
      continue;
    }
    for (const couleur of cuvee.couleurs) {
      const list = groups.get(couleur.nom) ?? [];
      if (!list.some((item) => item.id === cuvee.id)) list.push(cuvee);
      groups.set(couleur.nom, list);
    }
  }

  const named = [...groups.entries()].sort(([a], [b]) =>
    a.localeCompare(b, "fr"),
  );
  if (withoutColor.length > 0) named.push(["Autres", withoutColor]);
  return named;
}

async function DomaineContent({ params }: DomainePageProps) {
  const { slug } = await params;
  const domaine = await getDomaineBySlug(slug);

  if (!domaine) notFound();

  const location = [domaine.adresse, domaine.code_postal, domaine.ville]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="text-sm text-[var(--forest)] underline-offset-4 hover:underline"
      >
        ← Retour à la carte
      </Link>

      <div className="relative mt-5 overflow-hidden rounded-3xl border border-[#e4d9c8] bg-[#efe6d6]">
        {domaine.image_couverture_url ? (
          <Image
            src={domaine.image_couverture_url}
            alt={`Couverture de ${domaine.nom}`}
            width={1200}
            height={640}
            className="h-64 w-full object-cover"
          />
        ) : (
          <div className="flex h-56 items-end bg-[linear-gradient(160deg,#2f4a38_0%,#8fa585_100%)] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.16em] text-white/80">
              {domaine.ville ?? "Loire"}
            </p>
          </div>
        )}
      </div>

      <header className="mt-6">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8b9288]">
          {domaine.ville}
          {domaine.code_postal ? ` · ${domaine.code_postal}` : ""}
        </p>
        <div className="mt-1 flex flex-wrap items-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#2c322c]">
            {domaine.nom}
          </h1>
          <span className="ml-2 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
            Non vérifié
          </span>
        </div>
        {domaine.appellations.length > 0 || domaine.certifications.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {domaine.appellations.map((appellation) => (
              <li
                key={appellation.id}
                className="rounded-full border border-[#e4d9c8] bg-white px-3 py-1 text-xs text-[#5c5146]"
              >
                {appellation.nom}
              </li>
            ))}
            {domaine.certifications.map((certification) => (
              <li
                key={certification.id}
                className="rounded-full border border-[#4A7C59]/25 bg-[#4A7C59]/10 px-3 py-1 text-xs text-[#4A7C59]"
              >
                {certification.nom}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {domaine.description ? (
        <section className="mt-6 max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[#2c322c]">
            Mot du vigneron
          </h2>
          <p className="mt-2 text-base leading-7 text-[#5c5146]">
            {domaine.description}
          </p>
        </section>
      ) : null}

      <section className="mt-8 rounded-2xl border border-[#e4d9c8] bg-[#fffdf8] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[#2c322c]">
          Contact
        </h2>
        <dl className="mt-3 space-y-2 text-sm text-[#5c5146]">
          {location ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Adresse
              </dt>
              <dd>{location}</dd>
            </div>
          ) : null}
          {domaine.telephone ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Téléphone
              </dt>
              <dd>
                <a href={`tel:${domaine.telephone}`} className="hover:underline">
                  {domaine.telephone}
                </a>
              </dd>
            </div>
          ) : null}
          {domaine.email ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                E-mail
              </dt>
              <dd>
                <a href={`mailto:${domaine.email}`} className="hover:underline">
                  {domaine.email}
                </a>
              </dd>
            </div>
          ) : null}
          {domaine.site_web ? (
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Site
              </dt>
              <dd>
                <a
                  href={formatWebsite(domaine.site_web)}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-[var(--forest)] hover:underline"
                >
                  {domaine.site_web}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="mt-8 mb-12">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[#2c322c]">
          Cuvées
        </h2>
        {domaine.cuvees.length === 0 ? (
          <p className="mt-3 text-sm text-[#8b9288]">
            Aucune cuvée n’est encore renseignée pour ce domaine.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {groupCuveesByCouleur(domaine.cuvees).map(([couleur, cuvees]) => (
              <div key={couleur}>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b9288]">
                  {couleur}
                </h3>
                <ul className="mt-2 grid gap-4 sm:grid-cols-2">
                  {cuvees.map((cuvee) => (
                    <li
                      key={cuvee.id}
                      className="rounded-2xl border border-[#e4d9c8] bg-[#fffdf8] p-4"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={bottleImageForCouleur(cuvee.couleurs[0]?.nom)}
                          alt=""
                          width={20}
                          height={40}
                          className="h-10 w-auto object-contain"
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-stone-800">
                            {cuvee.nom}
                            {cuvee.millesime ? (
                              <span className="font-normal text-stone-500">
                                {" "}
                                {cuvee.millesime}
                              </span>
                            ) : null}
                          </h4>
                          {cuvee.cepages.length > 0 ? (
                            <ul className="mt-1 flex flex-wrap gap-1">
                              {cuvee.cepages.map((cepage) => (
                                <li
                                  key={cepage.nom}
                                  className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
                                >
                                  {cepage.nom}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </div>
                      {cuvee.description ? (
                        <p className="mt-2 text-sm leading-6 text-[#5c5146]">
                          {cuvee.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function DomainePage({ params }: DomainePageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 text-stone-500">
          Chargement…
        </main>
      }
    >
      <DomaineContent params={params} />
    </Suspense>
  );
}
