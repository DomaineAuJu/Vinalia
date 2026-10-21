import type {
  Appellation,
  Certification,
  Couleur,
  DomaineFilters,
} from "@/lib/types";

type DomaineFiltersProps = {
  filters: DomaineFilters;
  appellations: Appellation[];
  certifications: Certification[];
  couleurs: Couleur[];
  totalDomaines: number;
  onToggleAppellation: (nom: string) => void;
  onToggleCertification: (nom: string) => void;
  onToggleCouleur: (nom: string) => void;
  onReset: () => void;
};

export function DomaineFiltersBar({
  filters,
  appellations,
  certifications,
  couleurs,
  totalDomaines,
  onToggleAppellation,
  onToggleCertification,
  onToggleCouleur,
  onReset,
}: DomaineFiltersProps) {
  return (
    <aside className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#2c322c]">
            Filtres
          </h2>
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-[#4A7C59] underline-offset-4 hover:underline"
          >
            Réinitialiser
          </button>
        </div>
        <p className="mt-1 text-sm text-[#8b9288]">
          {totalDomaines} domaines référencés
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b9288]">
          Appellation
        </legend>
        <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
          {appellations.map((appellation) => (
            <label
              key={appellation.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-[#2c322c]"
            >
              <input
                type="checkbox"
                name={`appellation-${appellation.id}`}
                value={appellation.nom}
                checked={filters.selectedAppellations.includes(appellation.nom)}
                onChange={() => onToggleAppellation(appellation.nom)}
              />
              {appellation.nom}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b9288]">
          Certification
        </legend>
        <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
          {certifications.map((certification) => (
            <label
              key={certification.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-[#2c322c]"
            >
              <input
                type="checkbox"
                checked={filters.selectedCertifications.includes(
                  certification.nom,
                )}
                onChange={() => onToggleCertification(certification.nom)}
              />
              {certification.nom}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[#8b9288]">
          Couleurs
        </legend>
        <div className="flex max-h-48 flex-col gap-1.5 overflow-y-auto">
          {couleurs.map((couleur) => (
            <label
              key={couleur.nom}
              className="flex cursor-pointer items-center gap-2 text-sm text-[#2c322c]"
            >
              <input
                type="checkbox"
                checked={filters.selectedCouleurs.includes(couleur.nom)}
                onChange={() => onToggleCouleur(couleur.nom)}
              />
              {couleur.nom}
            </label>
          ))}
        </div>
      </fieldset>
    </aside>
  );
}
