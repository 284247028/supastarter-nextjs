"use client";

// @ts-ignore
import { Analytics } from "@vercel/analytics/react";
// @ts-ignore
import { track } from "@vercel/analytics";

export function AnalyticsScript() {
  return <Analytics />;
}

export function useAnalytics() {
  const trackEvent = (event: string, data?: Record<string, any>) => {
    track(event, data);
  };

  return {
    trackEvent,
  };
}
