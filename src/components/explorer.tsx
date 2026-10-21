"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DomaineCard } from "@/components/domaine-card";
import { DomaineFiltersBar } from "@/components/domaine-filters";
import { HeroExplorer } from "@/components/hero-explorer";
import { VigneronOverlay } from "@/components/vigneron-overlay";
import {
  emptyFilters,
  filterDomaines,
  toggleAppellation,
  toggleCertification,
  toggleCouleur,
  uniqueAppellations,
  uniqueCertifications,
  uniqueCouleurs,
} from "@/lib/filters";
import type { Domaine, DomaineFilters } from "@/lib/types";

const DomaineMap = dynamic(() => import("@/components/domaine-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-[1.25rem] bg-[#e8eee6] text-sm text-[#8b9288]">
      Chargement de la carte…
    </div>
  ),
});

type ExplorerProps = {
  domaines: Domaine[];
};

export function Explorer({ domaines }: ExplorerProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedAppellations, setSelectedAppellations] = useState<string[]>(
    () => [],
  );
  const [selectedCertifications, setSelectedCertifications] = useState<
    string[]
  >(() => []);
  const [selectedCouleurs, setSelectedCouleurs] = useState<string[]>(() => []);
  const [selectedDomaine, setSelectedDomaine] = useState<Domaine | null>(null);

  const filters: DomaineFilters = {
    searchText,
    selectedAppellations,
    selectedCertifications,
    selectedCouleurs,
  };

  const appellations = useMemo(() => uniqueAppellations(domaines), [domaines]);
  const certifications = useMemo(
    () => uniqueCertifications(domaines),
    [domaines],
  );
  const couleurs = useMemo(() => uniqueCouleurs(domaines), [domaines]);

  const filteredDomaines = useMemo(
    () => filterDomaines(domaines, filters),
    [
      domaines,
      searchText,
      selectedAppellations,
      selectedCertifications,
      selectedCouleurs,
    ],
  );

  const hasActiveFilters =
    searchText.trim().length > 0 ||
    selectedAppellations.length > 0 ||
    selectedCertifications.length > 0 ||
    selectedCouleurs.length > 0;

  function handleToggleAppellation(nom: string) {
    setSelectedAppellations(
      toggleAppellation(filters, nom).selectedAppellations,
    );
  }

  function handleToggleCertification(nom: string) {
    setSelectedCertifications(
      toggleCertification(filters, nom).selectedCertifications,
    );
  }

  function handleToggleCouleur(nom: string) {
    setSelectedCouleurs(toggleCouleur(filters, nom).selectedCouleurs);
  }

  function handleReset() {
    setSearchText(emptyFilters.searchText);
    setSelectedAppellations(emptyFilters.selectedAppellations);
    setSelectedCertifications(emptyFilters.selectedCertifications);
    setSelectedCouleurs(emptyFilters.selectedCouleurs);
  }

  useEffect(() => {
    setSelectedDomaine(null);
  }, [router.bfcacheId]);

  return (
    <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 pb-12 sm:px-6">
      <HeroExplorer
        query={searchText}
        resultCount={filteredDomaines.length}
        onQueryChange={setSearchText}
      />

      <div className="relative mt-8">
        <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
          <DomaineFiltersBar
            filters={filters}
            appellations={appellations}
            certifications={certifications}
            couleurs={couleurs}
            onToggleAppellation={handleToggleAppellation}
            onToggleCertification={handleToggleCertification}
            onToggleCouleur={handleToggleCouleur}
            totalDomaines={domaines.length}
            onReset={handleReset}
          />
          <section className="h-[28rem] overflow-hidden rounded-[1.25rem] sm:h-[34rem]">
            <DomaineMap
              key={router.bfcacheId}
              domaines={domaines}
              onSelect={setSelectedDomaine}
            />
          </section>
        </div>
        {selectedDomaine ? (
          <VigneronOverlay
            domaine={selectedDomaine}
            onClose={() => setSelectedDomaine(null)}
            onOpenFiche={(slug) => {
              setSelectedDomaine(null);
              router.push(`/domaines/${slug}`);
            }}
          />
        ) : null}
      </div>

      <section className="mt-8">
        {hasActiveFilters ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDomaines.length === 0 ? (
              <p className="col-span-full rounded-2xl border border-dashed border-[#e4e0d6] bg-white/70 p-6 text-sm text-[#8b9288]">
                Aucun domaine ne correspond à ces filtres.
              </p>
            ) : (
              filteredDomaines.map((domaine) => (
                <DomaineCard key={domaine.id} domaine={domaine} />
              ))
            )}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-[#e4e0d6] bg-white/70 p-10 text-center text-sm text-[#8b9288]">
            Utilisez les filtres ou la recherche pour découvrir nos vignerons
          </p>
        )}
      </section>
    </main>
  );
}
