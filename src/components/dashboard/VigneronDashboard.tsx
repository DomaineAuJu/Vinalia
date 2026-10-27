"use client";

import { useMemo, useState } from "react";
import { EditVigneronDrawer } from "@/components/dashboard/EditVigneronDrawer";
import type { VigneronData } from "@/lib/services/vigneron";
import type { VigneronInput } from "@/lib/validators/vigneron.schema";

type VigneronDashboardProps = {
  userId: string;
  initialData: VigneronData;
};

function mapEmbedUrl(latitude: number, longitude: number) {
  const delta = 0.03;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

export function VigneronDashboard({
  userId,
  initialData,
}: VigneronDashboardProps) {
  const [data, setData] = useState<VigneronData>(initialData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const embedUrl = useMemo(
    () => mapEmbedUrl(data.latitude, data.longitude),
    [data.latitude, data.longitude],
  );

  function handleSaved(next: VigneronInput) {
    setData((current) => ({ ...current, ...next }));
  }

  return (
    <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-10 sm:px-6">
      <p className="text-xs uppercase tracking-[0.16em] text-[#8b9288]">
        Espace vigneron
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[#2c322c]">
        Tableau de bord
      </h1>
      <p className="mt-2 text-sm text-[#5c5146]">{data.nom}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="order-2 rounded-2xl border border-[#e4d9c8] bg-[#fffdf8] p-6 shadow-[0_16px_40px_rgba(44,50,44,0.06)] lg:order-1">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#2c322c]">
              Mes informations
            </h2>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="rounded-full bg-[#3e5c45] px-4 py-2 text-sm text-white hover:bg-[#2f4a38]"
            >
              Modifier
            </button>
          </div>

          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Description
              </dt>
              <dd className="mt-1 leading-6 text-[#2c322c]">
                {data.description || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                E-mail de contact
              </dt>
              <dd className="mt-1 text-[#2c322c]">{data.contact_email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Téléphone
              </dt>
              <dd className="mt-1 text-[#2c322c]">{data.contact_phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Adresse
              </dt>
              <dd className="mt-1 text-[#2c322c]">{data.adresse || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-[#8b9288]">
                Horaires
              </dt>
              <dd className="mt-1 text-[#2c322c]">{data.horaires || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="order-1 flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-[#e4d9c8] bg-[#fffdf8] shadow-[0_16px_40px_rgba(44,50,44,0.06)] lg:order-2 lg:sticky lg:top-24 lg:min-h-[32rem]">
          <div className="border-b border-[#e4d9c8] px-6 py-4">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#2c322c]">
              Aperçu sur la carte
            </h2>
            <p className="mt-1 text-sm text-[#5c5146]">{data.adresse}</p>
          </div>
          <iframe
            title={`Carte du domaine ${data.nom}`}
            src={embedUrl}
            className="h-full min-h-[18rem] w-full flex-1 border-0 bg-[#e8eee6] lg:min-h-[26rem]"
            loading="lazy"
          />
        </section>
      </div>

      <EditVigneronDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userId={userId}
        initialData={data}
        onSaved={handleSaved}
      />
    </main>
  );
}
