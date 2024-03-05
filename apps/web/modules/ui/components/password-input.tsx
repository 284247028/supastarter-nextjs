"use client";

import React from "react";
import { Icon } from "./icon";
import { Input } from "./input";

export function PasswordInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={`relative ${className}`}>
      <Input
        type={showPassword ? "text" : "password"}
        className="pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-primary absolute inset-y-0 right-0 flex items-center pr-4 text-xl"
      >
        {showPassword ? (
          <Icon.hide className="h-4 w-4" />
        ) : (
          <Icon.show className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
