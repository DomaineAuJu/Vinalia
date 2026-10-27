import { z } from "zod";

const FRENCH_PHONE_REGEX =
  /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export const vigneronSchema = z.object({
  description: z
    .string()
    .trim()
    .max(500, "La description ne peut pas dépasser 500 caractères."),
  contact_email: z
    .string()
    .trim()
    .pipe(z.email("Adresse e-mail invalide.")),
  contact_phone: z
    .string()
    .trim()
    .regex(FRENCH_PHONE_REGEX, "Numéro de téléphone français invalide."),
  adresse: z.string().trim(),
  horaires: z.string().trim(),
});

export type VigneronInput = z.infer<typeof vigneronSchema>;
