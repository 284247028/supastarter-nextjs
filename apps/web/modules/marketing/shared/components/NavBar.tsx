"use client";

import { Link } from "@i18n";
import { useUser } from "@saas/auth/hooks/use-user";
import { ColorModeToggle } from "@shared/components/ColorModeToggle";
import { LocaleSwitch } from "@shared/components/LocaleSwitch";
import { Logo } from "@shared/components/Logo";
import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import { Sheet, SheetContent, SheetTrigger } from "@ui/components/sheet";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsClient } from "usehooks-ts";
import { Banner } from "./Banner";

export function NavBar() {
  const t = useTranslations();
  const { user, loaded: userLoaded } = useUser();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isClient = useIsClient();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const menuItems: {
    label: string;
    href: string;
  }[] = [
    {
      label: t("common.menu.pricing"),
      href: `/pricing`,
    },
    {
      label: t("common.menu.blog"),
      href: "/blog",
    },
  ];

  return (
    <nav
      className={`bg-background/80 fixed left-0 top-0 z-20 w-full backdrop-blur-lg`}
      data-test="navigation"
    >
      <Banner />

      <div className="container">
        <div className="flex items-center justify-stretch gap-6 py-8">
          <div className="flex flex-1 justify-start">
            <Link
              href="/"
              className="block hover:no-underline active:no-underline"
            >
              <Logo />
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center md:flex">
            {menuItems.map((menuItem) => (
              <Link
                key={menuItem.href}
                href={menuItem.href}
                className="block px-3 py-2 text-lg"
              >
                {menuItem.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <ColorModeToggle />
            <LocaleSwitch />

            <Sheet
              open={mobileMenuOpen}
              onOpenChange={(open) => setMobileMenuOpen(open)}
            >
              <SheetTrigger asChild>
                <Button className="md:hidden" size="icon" variant="outline">
                  <Icon.menu />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[250px]" side="right">
                <div className="flex flex-col items-start justify-center">
                  {menuItems.map((menuItem) => (
                    <Link
                      key={menuItem.href}
                      href={menuItem.href}
                      className="block px-3 py-2 text-lg"
                    >
                      {menuItem.label}
                    </Link>
                  ))}

                  <Link
                    key={user ? "dashboard" : "login"}
                    href={user ? `/app` : "/auth/login"}
                    className="block px-3 py-2 text-lg"
                    prefetch={!user}
                  >
                    {user ? t("common.menu.dashboard") : t("common.menu.login")}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            {isClient && userLoaded && (
              <>
                {user ? (
                  <Button
                    key="dashboard"
                    className="hidden md:block"
                    asChild
                    variant="ghost"
                  >
                    <Link href="/app">{t("common.menu.dashboard")}</Link>
                  </Button>
                ) : (
                  <Button
                    key="login"
                    className="hidden md:block"
                    asChild
                    variant="ghost"
                  >
                    <Link href="/auth/login">{t("common.menu.login")}</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
