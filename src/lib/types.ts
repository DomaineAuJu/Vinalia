export type Couleur = {
  id: string;
  nom: string;
  code_hex: string | null;
};

export type Appellation = {
  id: string;
  nom: string;
};

export type Certification = {
  id: string;
  nom: string;
};

export type Cepage = {
  nom: string;
};

export type Cuvee = {
  id: string;
  nom: string;
  millesime: number | string | null;
  description: string | null;
  image_url: string | null;
  couleurs: Couleur[];
  cepages: Cepage[];
};

export type Domaine = {
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
  appellations: Appellation[];
  certifications: Certification[];
  cuvees: Cuvee[];
};

export type DomaineFilters = {
  searchText: string;
  selectedAppellations: string[];
  selectedCertifications: string[];
  selectedCouleurs: string[];
};
