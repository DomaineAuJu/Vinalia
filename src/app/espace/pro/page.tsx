import { redirect } from "next/navigation";
import { VigneronDashboard } from "@/components/dashboard/VigneronDashboard";
import { getVigneronData } from "@/lib/services/vigneron";
import { getUserProfile } from "@/lib/services/user-profile";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function ProSpacePage() {
  const supabase = await createServerSupabase();
  const profile = await getUserProfile(supabase);

  if (profile?.role !== "pro") {
    redirect("/espace/visitor");
  }

  const initialData = await getVigneronData(profile.id);

  return <VigneronDashboard userId={profile.id} initialData={initialData} />;
}
