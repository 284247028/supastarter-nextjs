"use client";

import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import Link from "next/link";

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-2 text-2xl">Page not found</p>

      <Button asChild className="mt-4">
        <Link href="/">
          <Icon.undo className="mr-2 h-4 w-4" /> Go to homepage
        </Link>
      </Button>
    </div>
  );
}
