"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { isPostHogEnabled, posthogHost, posthogKey } from "@/lib/posthog";

type PostHogProviderProps = {
  children: React.ReactNode;
};

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    if (!isPostHogEnabled()) return;

    posthog.init(posthogKey, {
      api_host: posthogHost,
      defaults: "2026-08-30",
    });
  }, []);

  if (!isPostHogEnabled()) {
    return children;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
