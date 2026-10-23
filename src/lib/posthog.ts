export const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

export function isPostHogEnabled() {
  return posthogKey.length > 0;
}

export async function getPostHogServer() {
  if (!isPostHogEnabled()) {
    throw new Error("NEXT_PUBLIC_POSTHOG_KEY manquante.");
  }

  const { PostHog } = await import("posthog-node");
  return new PostHog(posthogKey, {
    host: posthogHost,
    flushAt: 1,
    flushInterval: 0,
  });
}
