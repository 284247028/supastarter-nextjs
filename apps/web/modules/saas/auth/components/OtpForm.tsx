"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@shared/lib/api-client";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@ui/components/form";
import { Icon } from "@ui/components/icon";
import { Input } from "@ui/components/input";
import { UserOneTimePasswordTypeType } from "database";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "../hooks/use-user";
import { TeamInvitationInfo } from "./TeamInvitationInfo";

const formSchema = z.object({
  code: z.string().min(6).max(6),
});

type FormValues = z.infer<typeof formSchema>;

export function OtpForm() {
  const t = useTranslations();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const { user, loaded } = useUser();
  const [serverError, setServerError] = useState<null | {
    title: string;
    message: string;
  }>(null);
  const searchParams = useSearchParams();

  const invitationCode = searchParams.get("invitationCode");
  const identifier = searchParams.get("identifier") || "";
  const type: UserOneTimePasswordTypeType = searchParams.get(
    "type",
  ) as UserOneTimePasswordTypeType;
  const redirectTo = invitationCode
    ? `/team/invitation?code=${invitationCode}`
    : searchParams.get("redirectTo") ?? "/app";

  const verifyOtpMutation = apiClient.auth.verifyOtp.useMutation();

  const handleRedirect = () => {
    window.location.href = new URL(
      redirectTo,
      window.location.origin,
    ).toString();
  };

  // redirect when user has been loaded
  useEffect(() => {
    if (user && loaded) handleRedirect();
  }, [user, loaded]);

  const onSubmit: SubmitHandler<FormValues> = async ({ code }) => {
    setServerError(null);
    try {
      await verifyOtpMutation.mutateAsync({
        code,
        type,
        identifier,
      });

      handleRedirect();
    } catch (e) {
      setServerError({
        title: t("auth.verifyOtp.hints.verificationFailed.title"),
        message: t("auth.verifyOtp.hints.verificationFailed.message"),
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("auth.verifyOtp.title")}</h1>
      <p className="text-muted-foreground mb-6 mt-2">
        {t("auth.verifyOtp.message")}
      </p>

      {invitationCode && <TeamInvitationInfo className="mb-6" />}

      <Form {...form}>
        <form
          className="flex flex-col items-stretch gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {form.formState.isSubmitted && serverError && (
            <Alert variant="error">
              <Icon.warning className="h-4 w-4" />
              <AlertTitle>{serverError.title}</AlertTitle>
              <AlertDescription>{serverError.message}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormControl>
                <FormItem>
                  <FormLabel>{t("auth.verifyOtp.otp")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              </FormControl>
            )}
          />

          <Button loading={form.formState.isSubmitting}>
            {t("auth.verifyOtp.submit")} &rarr;
          </Button>
        </form>
      </Form>
    </div>
  );
}
