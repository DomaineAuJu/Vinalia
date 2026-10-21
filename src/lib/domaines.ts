import { cacheLife } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase";
import type {
  Appellation,
  Certification,
  Couleur,
  Cuvee,
  Domaine,
} from "@/lib/types";

type RawCouleur = {
  nom: string;
  code_hex?: string | null;
};

type RawCouleurJoin = {
  couleurs: RawCouleur | RawCouleur[] | null;
};

type RawCepage = {
  nom: string;
};

type RawCepageJoin = {
  cepages: RawCepage | RawCepage[] | null;
};

type RawCuvee = {
  id: string;
  nom: string;
  millesime: number | string | null;
  description: string | null;
  image_url: string | null;
  cuvees_couleurs: RawCouleurJoin[] | null;
  cuvees_cepages: RawCepageJoin[] | null;
};

type RawAppellationJoin = {
  appellations: Appellation | Appellation[] | null;
};

type RawCertificationJoin = {
  certifications: Certification | Certification[] | null;
};

type RawDomaine = {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  latitude: number | null;
  longitude: number | null;
  telephone: string | null;
  email: string | null;
  site_web: string | null;
  image_couverture_url: string | null;
  domaines_appellations: RawAppellationJoin[] | null;
  domaines_certifications: RawCertificationJoin[] | null;
  cuvees: RawCuvee[] | null;
};

function asSingle<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }
  return result;
}

const DESCRIPTION_MAX_LENGTH = 800;

function capDescription(value: string | null): string | null {
  if (!value) return null;
  if (value.length <= DESCRIPTION_MAX_LENGTH) return value;
  return value.slice(0, DESCRIPTION_MAX_LENGTH);
}

function uniqueByNom<T extends { nom: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (seen.has(item.nom)) continue;
    seen.add(item.nom);
    result.push(item);
  }
  return result;
}

function mapCuvee(raw: RawCuvee): Cuvee {
  const couleurs = uniqueByNom(
    (raw.cuvees_couleurs ?? [])
      .map((join) => asSingle(join.couleurs))
      .filter((couleur): couleur is RawCouleur => Boolean(couleur?.nom))
      .map(
        (couleur): Couleur => ({
          id: couleur.nom,
          nom: couleur.nom,
          code_hex: couleur.code_hex ?? null,
        }),
      ),
  );

  const cepages = uniqueByNom(
    (raw.cuvees_cepages ?? [])
      .map((join) => asSingle(join.cepages))
      .filter((cepage): cepage is RawCepage => Boolean(cepage?.nom))
      .map((cepage) => ({ nom: cepage.nom })),
  );

  return {
    id: raw.id,
    nom: raw.nom,
    millesime: raw.millesime ?? null,
    description: capDescription(raw.description),
    image_url: raw.image_url,
    couleurs,
    cepages,
  };
}

function mapDomaine(raw: RawDomaine): Domaine {
  const appellations = uniqueById(
    (raw.domaines_appellations ?? [])
      .map((join) => asSingle(join.appellations))
      .filter((appellation): appellation is Appellation => Boolean(appellation)),
  );

  const certifications = uniqueById(
    (raw.domaines_certifications ?? [])
      .map((join) => asSingle(join.certifications))
      .filter((certification): certification is Certification =>
        Boolean(certification),
      ),
  );

  const cuvees = (raw.cuvees ?? []).map(mapCuvee);

  return {
    id: raw.id,
    nom: raw.nom,
    slug: raw.slug,
    description: capDescription(raw.description),
    adresse: raw.adresse,
    code_postal: raw.code_postal,
    ville: raw.ville,
    latitude: raw.latitude,
    longitude: raw.longitude,
    telephone: raw.telephone,
    email: raw.email,
    site_web: raw.site_web,
    image_couverture_url: raw.image_couverture_url,
    appellations,
    certifications,
    cuvees,
  };
}

const domaineSelect = `
  id,
  nom,
  slug,
  description,
  adresse,
  code_postal,
  ville,
  latitude,
  longitude,
  telephone,
  email,
  site_web,
  image_couverture_url,
  domaines_appellations (
    appellations ( id, nom )
  ),
  domaines_certifications (
    certifications ( id, nom )
  ),
  cuvees (
    id,
    nom,
    millesime,
    description,
    image_url,
    cuvees_couleurs (
      couleurs ( nom, code_hex )
    ),
    cuvees_cepages (
      cepages ( nom )
    )
  )
`;

export async function getDomaines(): Promise<Domaine[]> {
  "use cache";
  cacheLife("hours");

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("domaines")
    .select(domaineSelect)
    .order("nom", { ascending: true });

  if (error) {
    throw new Error(`Impossible de charger les domaines: ${error.message}`);
  }

  return ((data ?? []) as RawDomaine[]).map(mapDomaine);
}

export async function getDomaineBySlug(slug: string): Promise<Domaine | null> {
  const domaines = await getDomaines();
  return domaines.find((domaine) => domaine.slug === slug) ?? null;
}
