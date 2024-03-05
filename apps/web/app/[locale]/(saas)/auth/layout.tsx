import { Link } from "@i18n";
import { UserContextProvider } from "@saas/auth/lib/user-context";
import { ColorModeToggle } from "@shared/components/ColorModeToggle";
import { LocaleSwitch } from "@shared/components/LocaleSwitch";
import { Logo } from "@shared/components/Logo";
import { Card } from "@ui/components/card";
import { useLocale } from "next-intl";
import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren<{}>) {
  const locale = useLocale();

  return (
    <UserContextProvider initialUser={null}>
      <div className="bg-muted text-foreground flex min-h-screen place-items-center">
        <div className="container">
          <div className="mx-auto grid w-full max-w-md gap-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="block">
                <Logo />
              </Link>

              <div className="flex items-center justify-end gap-2">
                <LocaleSwitch />
                <ColorModeToggle />
              </div>
            </div>

            <Card className="p-8">{children}</Card>
          </div>
        </div>
      </div>
    </UserContextProvider>
  );
}
