import { AnalyticsScript } from "@analytics";
import { ClientProviders } from "@shared/components/ClientProviders";
import { Toaster } from "@ui/components/toaster";
import { cn } from "@ui/lib";
import { Metadata } from "next";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { getMessagesForLocale } from "../../i18n";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    absolute: "supastarter.nextjs - Application",
    default: "supastarter.nextjs- Application",
    template: "%s | supastarter.nextjs - Application",
  },
};

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = useLocale();

  if (params.locale !== locale) notFound();

  const messages = await getMessagesForLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          sansFont.variable,
        )}
      >
        <NextTopLoader color={"var(--colors-primary)"} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders>{children}</ClientProviders>
          <Toaster />
        </NextIntlClientProvider>
        <AnalyticsScript />
      </body>
    </html>
  );
}
