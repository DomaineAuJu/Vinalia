"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function EspaceMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  function goTo(href: string) {
    setIsOpen(false);
    router.push(href);
  }

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-1 rounded-full bg-[#3e5c45] px-4 py-2 text-sm text-white hover:bg-[#2f4a38]"
      >
        Mon espace
        <span aria-hidden className="text-xs">
          ▾
        </span>
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-[#e4d9c8] bg-white p-1.5 shadow-[0_12px_32px_rgba(44,50,44,0.12)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => goTo("/login?role=pro")}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#2c322c] hover:bg-[#f6f3ec]"
          >
            Espace Vigneron
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => goTo("/login?role=visitor")}
            className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-[#8b9288] hover:bg-[#f6f3ec]"
          >
            Espace Visiteur
            <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-stone-500">
              Bientôt
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
