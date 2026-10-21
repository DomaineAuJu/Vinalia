export const COULEUR_CHIPS = [
  { key: "rouge", label: "Rouge" },
  { key: "blanc", label: "Blanc" },
  { key: "rose", label: "Rosé" },
  { key: "effervescent", label: "Effervescent" },
] as const;

export type CouleurChipKey = (typeof COULEUR_CHIPS)[number]["key"];

function normalizeNom(nom: string) {
  return nom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function couleurChipKey(nom: string): CouleurChipKey | null {
  const value = normalizeNom(nom);
  if (value.includes("rouge")) return "rouge";
  if (value.includes("blanc")) return "blanc";
  if (value.includes("rose")) return "rose";
  if (
    value.includes("petillant") ||
    value.includes("effervescent") ||
    value.includes("mousseux")
  ) {
    return "effervescent";
  }
  return null;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_URL = `${SUPABASE_URL}/storage/v1/object/public/Images%20generiques/`;

export const couleurToImage: Record<string, string> = {
  blanc: `${BUCKET_URL}Blanc.png`,
  rouge: `${BUCKET_URL}Rouge.png`,
  bulles: `${BUCKET_URL}Bulles.png`,
  pétillant: `${BUCKET_URL}Bulles.png`,
  rose: `${BUCKET_URL}Blanc.png`,
  orange: `${BUCKET_URL}Blanc.png`,
};

export function bottleImageForCouleur(nom: string | null | undefined): string {
  const couleurNom = nom?.toLowerCase() || "blanc";
  return couleurToImage[couleurNom] || couleurToImage.blanc;
}
