import { Footer } from "@marketing/shared/components/Footer";
import { NavBar } from "@marketing/shared/components/NavBar";
import { UserContextProvider } from "@saas/auth/lib/user-context";
import { PropsWithChildren } from "react";

export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <UserContextProvider initialUser={null}>
      <NavBar />
      <main className="min-h-screen pt-40">{children}</main>
      <Footer />
    </UserContextProvider>
  );
}
