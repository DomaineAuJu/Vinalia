import { Suspense } from "react";
import { connection } from "next/server";
import { Explorer } from "@/components/explorer";
import { getDomaines } from "@/lib/domaines";

function ExplorerFallback() {
  return (
    <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 pb-12 sm:px-6">
      <div className="h-[22rem] animate-pulse rounded-[1.75rem] bg-[#e8eee6] sm:h-[26rem]" />
      <div className="mt-8 h-[34rem] animate-pulse rounded-[1.25rem] bg-[#e8eee6]" />
    </main>
  );
}

async function HomeExplorer() {
  await connection();
  const domaines = await getDomaines();
  return <Explorer domaines={domaines} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<ExplorerFallback />}>
      <HomeExplorer />
    </Suspense>
  );
}
