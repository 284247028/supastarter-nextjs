"use client";

import { Button } from "@ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { cn } from "@ui/lib";
import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";

export function ActionBlock({
  children,
  title,
  danger,
  onSubmit,
  isSubmitting,
  isSubmitDisabled,
  className,
  submitLabel,
}: PropsWithChildren<{
  onSubmit?: () => void;
  title: string;
  danger?: boolean;
  isSubmitting?: boolean;
  isSubmitDisabled?: boolean;
  submitLabel?: string;
  className?: string;
}>) {
  const t = useTranslations();

  return (
    <Card
      className={cn(className, danger ? "border-destructive/50 border" : "")}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
      >
        <CardHeader>
          <CardTitle className={danger ? "text-destructive" : ""}>
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {children}

          {typeof onSubmit !== "undefined" && (
            <div className=" mt-6 flex justify-end border-t pt-3">
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                loading={isSubmitting}
                variant={danger ? "error" : "default"}
              >
                {submitLabel || t("settings.save")}
              </Button>
            </div>
          )}
        </CardContent>
      </form>
    </Card>
  );
}
