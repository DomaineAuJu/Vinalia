import { redirect } from "next/navigation";

type VigneronRedirectProps = {
  params: Promise<{ slug: string }>;
};

export default async function VigneronRedirect({
  params,
}: VigneronRedirectProps) {
  const { slug } = await params;
  redirect(`/domaines/${slug}`);
}
