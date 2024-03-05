import { Button } from "@react-email/components";
import { PropsWithChildren } from "react";

export default function PrimaryButton({
  href,
  children,
}: PropsWithChildren<{
  href: string;
}>) {
  return (
    <Button
      href={href}
      className="bg-primary text-primary-foreground rounded-md px-4 py-2"
    >
      {children}
    </Button>
  );
}
