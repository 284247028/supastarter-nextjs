"use client";

import { appConfig } from "@config";
import { Link, usePathname } from "@i18n";
import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu";
import { useUser } from "@saas/auth/hooks/use-user";
import { UserAvatar } from "@shared/components/UserAvatar";
import { apiClient } from "@shared/lib/api-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Icon } from "@ui/components/icon";
import { useToast } from "@ui/hooks/use-toast";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const { locales, localeLabels } = appConfig.i18n;

export function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();
  const t = useTranslations();
  const { user, logout } = useUser();
  const { toast } = useToast();
  const [locale, setLocale] = useState<string>(currentLocale);
  const { setTheme: setCurrentTheme, theme: currentTheme } = useTheme();
  const [theme, setTheme] = useState<string>(currentTheme ?? "system");

  const unimpersonateMutation = apiClient.admin.unimpersonate.useMutation();

  const colorModeOptions = [
    {
      value: "system",
      label: "System",
      icon: Icon.system,
    },
    {
      value: "light",
      label: "Light",
      icon: Icon.lightMode,
    },
    {
      value: "dark",
      label: "Dark",
      icon: Icon.darkMode,
    },
  ];

  if (!user) return null;

  const { name, email, avatarUrl } = user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus-visible:ring-primary rounded-full outline-none focus-visible:ring-2">
          <UserAvatar name={name ?? ""} avatarUrl={avatarUrl} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {name}
          <span className="block text-xs font-normal opacity-70">{email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Color mode selection */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icon.lightMode className="mr-2 h-4 w-4" />
            {t("dashboard.userMenu.colorMode")}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => {
                  setTheme(value);
                  setCurrentTheme(value);
                }}
              >
                {colorModeOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    <option.icon className="mr-2 h-4 w-4 opacity-50" />
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Language selection */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icon.language className="mr-2 h-4 w-4" />
            {t("dashboard.userMenu.language")}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={locale}
                onValueChange={(value) => {
                  setLocale(value);
                  router.replace(
                    `/${value}/${pathname}?${searchParams.toString()}`,
                  );
                }}
              >
                {locales.map((locale) => {
                  return (
                    <DropdownMenuRadioItem key={locale} value={locale}>
                      {locale in localeLabels
                        ? localeLabels[locale as keyof typeof localeLabels]
                        : locale}
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/app/settings/account/general`}>
            <Icon.settings className="mr-2 h-4 w-4" />
            {t("dashboard.userMenu.accountSettings")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <Icon.docs className="mr-2 h-4 w-4" />
            {t("dashboard.userMenu.documentation")}
          </a>
        </DropdownMenuItem>

        {user.impersonatedBy && (
          <DropdownMenuItem
            onClick={async () => {
              const { dismiss } = toast({
                variant: "loading",
                title: t("admin.users.impersonation.unimpersonating"),
              });
              await unimpersonateMutation.mutateAsync();
              dismiss();
              window.location.reload();
            }}
          >
            <Icon.unimpersonate className="mr-2 h-4 w-4" />
            {t("dashboard.userMenu.unimpersonate")}
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={logout}>
          <Icon.logout className="mr-2 h-4 w-4" />
          {t("dashboard.userMenu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
