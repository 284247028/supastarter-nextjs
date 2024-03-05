"use client";

import { Link, usePathname } from "@i18n";
import { cn } from "@ui/lib";
import React from "react";

export function SettingsMenu({
  menuItems,
}: {
  menuItems: Array<{
    title: string;
    avatar: React.ReactNode;
    items: Array<{
      title: string;
      href: string;
    }>;
  }>;
}) {
  const pathname = usePathname();

  const isActiveMenuItem = (href: string) => pathname.includes(href);

  return (
    <div className="space-y-8">
      {menuItems.map((item, i) => (
        <div key={i}>
          <div className="flex items-center justify-start gap-2">
            {item.avatar}
            <h2 className="text-muted-foreground">{item.title}</h2>
          </div>

          <ul className="mt-1 list-none">
            {item.items.map((subitem, k) => (
              <li key={k}>
                <Link
                  href={subitem.href}
                  className={cn(
                    "block py-1.5 pl-10",
                    isActiveMenuItem(subitem.href) ? "font-bold" : "",
                  )}
                >
                  {subitem.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
