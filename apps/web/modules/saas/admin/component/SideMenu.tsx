"use client";

import { Link, usePathname } from "@i18n";
import { Icon } from "@ui/components/icon";
import { cn } from "@ui/lib";

export function SideMenu({
  menuItems,
}: {
  menuItems: Array<{
    title: string;
    href: string;
    icon: keyof typeof Icon;
  }>;
}) {
  const pathname = usePathname();

  const isActiveMenuItem = (href: string) => pathname.includes(href);

  return (
    <div className="space-y-8">
      <ul className="list-none">
        {menuItems.map((item, k) => {
          const ItemIcon = Icon[item.icon];

          return (
            <li key={k}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2 py-1.5",
                  isActiveMenuItem(item.href) ? "font-bold" : "",
                )}
              >
                <ItemIcon className="h-4 w-4 opacity-75" />
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
