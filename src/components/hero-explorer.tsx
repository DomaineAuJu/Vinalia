import Image from "next/image";

type HeroExplorerProps = {
  query: string;
  resultCount: number;
  onQueryChange: (value: string) => void;
};

export function HeroExplorer({
  query,
  resultCount,
  onQueryChange,
}: HeroExplorerProps) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem]">
      <Image
        src="/hero-loire.jpg"
        alt="Vignoble et village de Loire"
        width={2000}
        height={1499}
        priority
        className="h-[22rem] w-full object-cover sm:h-[26rem]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,36,28,0.55)_0%,rgba(28,36,28,0.18)_55%,rgba(28,36,28,0.08)_100%)]" />
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/80">
          Pays nantais · Muscadet
        </p>
        <h1 className="mt-3 max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] text-white sm:text-5xl">
          Des vignerons, et sur tout le territoire.
        </h1>
        <div className="mt-8 flex max-w-xl items-center rounded-full bg-white p-1.5 shadow-lg">
          <span className="pl-4 text-[#8b9288]" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Domaine, vigneron, appellation..."
            className="h-11 flex-1 bg-transparent px-3 text-sm text-[#2c322c] outline-none placeholder:text-[#8b9288]"
          />
          <span className="mr-1 shrink-0 rounded-full bg-[#3e5c45] px-4 py-2 text-sm text-white">
            {resultCount} domaine{resultCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </section>
  );
}
