export async function setupTOTP(
  userId: string,
): Promise<{ secret: string; qrCodeUrl: string }> {
  // TODO: Implémenter TOTP avec otpauth ici
  void userId;
  return {
    secret: "MOCKTOTPSECRET000000",
    qrCodeUrl:
      "otpauth://totp/Cellarote:user?secret=MOCKTOTPSECRET000000&issuer=Cellarote",
  };
}

export async function verifyTOTP(userId: string, token: string): Promise<boolean> {
  // TODO: Implémenter TOTP avec otpauth ici
  void userId;
  void token;
  return true;
}
