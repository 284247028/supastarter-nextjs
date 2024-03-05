"use client";

import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import { useTranslations } from "next-intl";
import React, { JSXElementConstructor } from "react";

const providers: Record<
  string,
  {
    name: string;
    icon: JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
  }
> = {
  google: {
    name: "Google",
    icon: Icon.google,
  },
  apple: {
    name: "Apple",
    icon: Icon.apple,
  },
  github: {
    name: "Github",
    icon: Icon.github,
  },
  twitter: {
    name: "Twitter",
    icon: Icon.twitter,
  },
};

export function SocialSigninButton({
  provider,
  className,
}: {
  provider: keyof typeof providers;
  className?: string;
}) {
  const t = useTranslations();
  const providerData = providers[provider];

  return (
    <Button asChild variant="outline" type="button" className={className}>
      <a href={`/api/oauth/${provider}`}>
        {providerData.icon && (
          <i className="mr-2 opacity-70">
            <providerData.icon className="h-4 w-4" />
          </i>
        )}
        {t("auth.continueWithProvider", { provider: providerData.name })}
      </a>
    </Button>
  );
}
