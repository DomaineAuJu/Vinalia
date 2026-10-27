import { cookies } from "next/headers";
import { VisitorSpaceClient } from "@/app/espace/visitor/visitor-space-client";

export default async function VisitorSpacePage() {
  await cookies();
  return <VisitorSpaceClient />;
}
