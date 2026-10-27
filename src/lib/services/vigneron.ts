import {
  vigneronSchema,
  type VigneronInput,
} from "@/lib/validators/vigneron.schema";

export type VigneronData = VigneronInput & {
  nom: string;
  latitude: number;
  longitude: number;
};

export type VigneronUpdateSuccess = {
  ok: true;
  data: VigneronInput;
};

export type VigneronUpdateFailure = {
  ok: false;
  message: string;
  fieldErrors: Partial<Record<keyof VigneronInput, string>>;
};

export type VigneronUpdateResult = VigneronUpdateSuccess | VigneronUpdateFailure;

const MOCK_VIGNERON: VigneronData = {
  nom: "Domaine des Frères Couillaud",
  description:
    "Vignoble familial en Muscadet Sèvre-et-Maine, entre Vallet et le palus de la Loire.",
  contact_email: "contact@couillaud.fr",
  contact_phone: "02 40 36 22 44",
  adresse: "12 rue des Vignes, 44330 Vallet",
  horaires: "Du lundi au samedi, 9h–12h et 14h–18h",
  latitude: 47.1619,
  longitude: -1.2661,
};

function fieldErrorsFromZod(error: {
  issues: Array<{ message: string; path: PropertyKey[] }>;
}): Partial<Record<keyof VigneronInput, string>> {
  const fieldErrors: Partial<Record<keyof VigneronInput, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (
      key === "description" ||
      key === "contact_email" ||
      key === "contact_phone" ||
      key === "adresse" ||
      key === "horaires"
    ) {
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export async function getVigneronData(userId: string): Promise<VigneronData> {
  void userId;
  return MOCK_VIGNERON;
}

export async function updateVigneronData(
  userId: string,
  data: VigneronInput,
): Promise<VigneronUpdateResult> {
  const parsed = vigneronSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Formulaire invalide.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  console.log("updateVigneronData", { userId, data: parsed.data });
  return { ok: true, data: parsed.data };
}
