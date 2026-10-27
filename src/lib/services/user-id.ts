export function generateUniqueId(): string {
  const source =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : Array.from({ length: 12 }, () =>
          Math.floor(Math.random() * 36).toString(36),
        ).join("");

  return `usr_${source.slice(0, 12)}`;
}
