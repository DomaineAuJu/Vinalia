import Link from "next/link";

function GrapeMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-7 w-7 text-[#3e5c45]"
    >
      <path
        fill="currentColor"
        d="M12.2 3.2c.9 1.4.7 2.8 0 3.8 1.2.1 2.3.7 2.9 1.7-.7-.2-1.5-.1-2.2.2.9.7 1.4 1.8 1.3 3 0 .3-.1.6-.2.9.9 0 1.8.4 2.4 1.2-.6.1-1.1.4-1.5.8.6.8.9 1.8.7 2.8-.8-.4-1.7-.4-2.5 0 .1-.8-.1-1.6-.6-2.3-.4.7-1.1 1.1-1.9 1.2 0 .9-.3 1.7-1 2.3-.3-.8-.2-1.7.3-2.4-.8-.2-1.4-.8-1.7-1.6.6 0 1.3-.2 1.8-.6-.7-.6-1-1.5-.9-2.4.7.4 1.6.4 2.3 0-.4-.7-1-1.3-1.8-1.5.6-.6.9-1.4.8-2.3.8.4 1.7.3 2.5-.4Z"
      />
      <circle cx="8.6" cy="11.2" r="1.35" fill="currentColor" />
      <circle cx="12" cy="9.6" r="1.35" fill="currentColor" />
      <circle cx="15.5" cy="11.1" r="1.35" fill="currentColor" />
      <circle cx="10.2" cy="14.2" r="1.35" fill="currentColor" />
      <circle cx="13.7" cy="14.1" r="1.35" fill="currentColor" />
    </svg>
  );
}

const upcomingLinks = [{ label: "Oenotourisme" }, { label: "Salons" }];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-[#f6f3ec]/95 backdrop-blur">
      <div className="mx-auto flex h-[4.25rem] max-w-[1240px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <GrapeMark />
          <span className="font-[family-name:var(--font-display)] text-[1.65rem] leading-none text-[#2c322c]">
            Vinalia
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-[#2c322c]">
            Explorer
          </Link>
          {upcomingLinks.map((link) => (
            <span
              key={link.label}
              title="Bientôt disponible"
              className="hidden cursor-not-allowed text-[#b4b9b1] sm:inline"
            >
              {link.label}
            </span>
          ))}
          <button
            type="button"
            disabled
            title="Bientôt disponible"
            className="inline-flex items-center gap-1 rounded-full bg-[#3e5c45] px-4 py-2 text-sm text-white"
          >
            Mon espace
            <span aria-hidden className="text-xs">
              ▾
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
