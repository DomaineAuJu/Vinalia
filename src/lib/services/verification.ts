export async function verifySiret(
  siret: string,
): Promise<{ isValid: boolean; companyName?: string }> {
  // TODO: Appeler API INPI ou Pappers ici
  void siret;
  return { isValid: true };
}
