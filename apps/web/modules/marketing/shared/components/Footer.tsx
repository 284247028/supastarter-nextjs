import { Logo } from "@shared/components/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-12">
      <div className="container grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-sm opacity-70">
            © {new Date().getFullYear()} supastarter. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/blog" className="block">
            Blog
          </Link>

          <a href="#" className="block">
            Features
          </a>

          <a href="#" className="block">
            Pricing
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <a href="#" className="block">
            Privacy policy
          </a>

          <a href="#" className="block">
            Terms of service
          </a>

          <a href="#" className="block">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
