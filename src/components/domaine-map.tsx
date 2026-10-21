"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import { hasCoordinates } from "@/lib/filters";
import type { Domaine } from "@/lib/types";
import "leaflet/dist/leaflet.css";

type DomaineMapProps = {
  domaines: Domaine[];
  onSelect: (domaine: Domaine) => void;
};

const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" aria-hidden="true">
  <path fill="#4A7C59" d="M16 41.2C16 41.2 2.5 26.6 2.5 15.4 2.5 7.9 8.5 1.8 16 1.8s13.5 6.1 13.5 13.6C29.5 26.6 16 41.2 16 41.2z"/>
  <path fill="#ffffff" d="M16.1 8.2c.9 1.1.8 2.1.1 2.8 1 .1 1.8.6 2.2 1.4-.6-.1-1.2 0-1.7.2.7.5 1.1 1.4 1 2.3 0 .2 0 .5-.1.7.7 0 1.4.3 1.8.9-.5.1-.9.3-1.2.6.5.6.7 1.4.6 2.2-.6-.3-1.3-.3-1.9 0 .1-.6-.1-1.2-.5-1.7-.3.5-.8.8-1.4.9 0 .7-.2 1.3-.8 1.7-.2-.6-.1-1.3.3-1.8-.6-.2-1.1-.6-1.3-1.2.5 0 1-.1 1.4-.4-.5-.5-.8-1.1-.7-1.8.6.3 1.2.3 1.8 0-.3-.5-.8-1-1.4-1.1.5-.5.7-1.1.6-1.7.6.3 1.3.2 1.9-.3z"/>
  <circle cx="13.5" cy="15.1" r="1.15" fill="#ffffff"/>
  <circle cx="16.1" cy="13.7" r="1.15" fill="#ffffff"/>
  <circle cx="18.7" cy="15.1" r="1.15" fill="#ffffff"/>
  <circle cx="14.7" cy="17.4" r="1.15" fill="#ffffff"/>
  <circle cx="17.5" cy="17.4" r="1.15" fill="#ffffff"/>
</svg>
`;

const pinIcon = L.divIcon({
  className: "vinalia-pin",
  iconSize: [32, 42],
  iconAnchor: [16, 41],
  tooltipAnchor: [0, -36],
  html: PIN_SVG,
});

function FitMarkers({
  points,
}: {
  points: Array<{ id: string; latitude: number; longitude: number }>;
}) {
  const map = useMap();
  const key = points.map((point) => point.id).join(",");

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].latitude, points[0].longitude], 11);
      return;
    }
    const bounds = L.latLngBounds(
      points.map((point) => [point.latitude, point.longitude] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 11 });
  }, [key, map, points]);

  return null;
}

function LeafletMap({ domaines, onSelect }: DomaineMapProps) {
  const points = domaines.filter(hasCoordinates);

  return (
    <MapContainer
      center={[47.25, -0.7]}
      zoom={8}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitMarkers points={points} />
      {points.map((domaine) => (
        <Marker
          key={domaine.id}
          position={[domaine.latitude, domaine.longitude]}
          icon={pinIcon}
          eventHandlers={{
            click: (event) => {
              event.target.closeTooltip();
              onSelect(domaine);
            },
          }}
        >
          <Tooltip
            className="vinalia-tooltip"
            direction="top"
            offset={[0, -8]}
            opacity={1}
          >
            <div className="min-w-[160px] max-w-[220px]">
              <p className="font-semibold leading-snug text-[#2c322c]">
                {domaine.nom}
              </p>
              <span className="mt-1 inline-block rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">
                Non vérifié
              </span>
              {domaine.ville ? (
                <p className="mt-1 text-xs text-[#8b9288]">{domaine.ville}</p>
              ) : null}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default function DomaineMap({ domaines, onSelect }: DomaineMapProps) {
  const [isActive, setIsActive] = useState(false);

  useLayoutEffect(() => {
    setIsActive(true);
    return () => setIsActive(false);
  }, []);

  if (!isActive) {
    return (
      <div className="flex h-full items-center justify-center bg-[#e8eee6] text-sm text-[#8b9288]">
        Chargement de la carte…
      </div>
    );
  }

  return <LeafletMap domaines={domaines} onSelect={onSelect} />;
}
