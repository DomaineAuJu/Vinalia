import { z } from "zod";

const confirmPasswordField = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères");

function passwordsMatch<T extends { password: string; confirmPassword: string }>(
  data: T,
) {
  return data.password === data.confirmPassword;
}

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "L’e-mail est obligatoire.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Adresse e-mail invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const userSignUpSchema = signInSchema
  .extend({
    confirmPassword: confirmPasswordField,
  })
  .refine(passwordsMatch, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export const signUpSchema = signInSchema
  .extend({
    nom: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
    siret: z
      .string()
      .trim()
      .regex(
        /^\d{14}$/,
        "Le numéro SIRET doit contenir exactement 14 caractères",
      ),
    confirmPassword: confirmPasswordField,
  })
  .refine(passwordsMatch, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type UserSignUpInput = z.infer<typeof userSignUpSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
