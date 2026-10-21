import type {
  Appellation,
  Certification,
  Couleur,
  Domaine,
  DomaineFilters,
} from "@/lib/types";

export const emptyFilters: DomaineFilters = {
  searchText: "",
  selectedAppellations: [],
  selectedCertifications: [],
  selectedCouleurs: [],
};

export function filterDomaines(
  domaines: Domaine[],
  filters: DomaineFilters,
): Domaine[] {
  const query = filters.searchText.trim().toLocaleLowerCase("fr-FR");

  return domaines.filter((domaine) => {
    const matchesSearch =
      query.length === 0 ||
      domaine.nom.toLocaleLowerCase("fr-FR").includes(query) ||
      (domaine.ville ?? "").toLocaleLowerCase("fr-FR").includes(query);

    const matchesAppellations =
      filters.selectedAppellations.length === 0 ||
      domaine.appellations.some((appellation) =>
        filters.selectedAppellations.includes(appellation.nom),
      );

    const matchesCertifications =
      filters.selectedCertifications.length === 0 ||
      domaine.certifications.some((certification) =>
        filters.selectedCertifications.includes(certification.nom),
      );

    const matchesCouleurs =
      filters.selectedCouleurs.length === 0 ||
      domaine.cuvees.some((cuvee) =>
        cuvee.couleurs.some((couleur) =>
          filters.selectedCouleurs.includes(couleur.nom),
        ),
      );

    return (
      matchesSearch &&
      matchesAppellations &&
      matchesCertifications &&
      matchesCouleurs
    );
  });
}

export function uniqueAppellations(domaines: Domaine[]): Appellation[] {
  const byId = new Map<string, Appellation>();
  for (const domaine of domaines) {
    for (const appellation of domaine.appellations) {
      byId.set(appellation.id, appellation);
    }
  }
  return [...byId.values()].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}

export function uniqueCertifications(domaines: Domaine[]): Certification[] {
  const byId = new Map<string, Certification>();
  for (const domaine of domaines) {
    for (const certification of domaine.certifications) {
      byId.set(certification.id, certification);
    }
  }
  return [...byId.values()].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}

export function uniqueCouleurs(domaines: Domaine[]): Couleur[] {
  const byNom = new Map<string, Couleur>();
  for (const domaine of domaines) {
    for (const cuvee of domaine.cuvees) {
      for (const couleur of cuvee.couleurs) {
        byNom.set(couleur.nom, couleur);
      }
    }
  }
  return [...byNom.values()].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}

export function hasCoordinates(
  domaine: Domaine,
): domaine is Domaine & { latitude: number; longitude: number } {
  return domaine.latitude != null && domaine.longitude != null;
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function toggleAppellation(
  filters: DomaineFilters,
  nom: string,
): DomaineFilters {
  return {
    ...filters,
    selectedAppellations: toggleValue(filters.selectedAppellations, nom),
  };
}

export function toggleCertification(
  filters: DomaineFilters,
  nom: string,
): DomaineFilters {
  return {
    ...filters,
    selectedCertifications: toggleValue(filters.selectedCertifications, nom),
  };
}

export function toggleCouleur(
  filters: DomaineFilters,
  nom: string,
): DomaineFilters {
  return {
    ...filters,
    selectedCouleurs: toggleValue(filters.selectedCouleurs, nom),
  };
}
