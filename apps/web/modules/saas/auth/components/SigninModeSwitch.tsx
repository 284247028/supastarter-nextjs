"use client";

import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs";

export default function SigninModeSwitch({
  activeMode,
  onChange,
  className,
}: {
  activeMode: "password" | "magic-link";
  onChange: (mode: string) => void;
  className?: string;
}) {
  const modes = [
    {
      value: "magic-link",
      label: "Magic Link",
    },
    {
      value: "password",
      label: "Password",
    },
  ];

  return (
    <Tabs value={activeMode} onValueChange={onChange} className={className}>
      <TabsList className="w-full">
        <TabsTrigger value="magic-link" className="flex-1">
          Magic Link
        </TabsTrigger>
        <TabsTrigger value="password" className="flex-1">
          Password
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
