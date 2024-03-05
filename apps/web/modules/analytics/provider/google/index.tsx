"use client";

import Script from "next/script";

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string;

export function AnalyticsScript() {
  return (
    <Script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      onLoad={() => {
        if (typeof window === "undefined") return;

        (window as any).dataLayer = (window as any).dataLayer || [];

        function gtag() {
          (window as any).dataLayer.push(arguments);
        }
        // @ts-ignore
        gtag("js", new Date());
        // @ts-ignore
        gtag("config", googleAnalyticsId);
      }}
    />
  );
}

export function useAnalytics() {
  const trackEvent = (event: string, data?: Record<string, any>) => {
    if (typeof window === "undefined" || !(window as any).gta) {
      return;
    }

    (window as any).gta("event", event, data);
  };

  return {
    trackEvent,
  };
}
