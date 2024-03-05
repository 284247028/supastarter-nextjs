"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@shared/lib/api-client";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import { Input } from "@ui/components/input";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const t = useTranslations();
  const router = useRouter();
  const [serverError, setServerError] = useState<null | {
    title: string;
    message: string;
  }>(null);

  const forgotPasswordMutation = apiClient.auth.forgotPassword.useMutation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async ({ email }) => {
    try {
      await forgotPasswordMutation.mutateAsync({
        email,
        callbackUrl: new URL("/auth/verify", window.location.origin).toString(),
      });

      const redirectSearchParams = new URLSearchParams();
      redirectSearchParams.set("type", "PASSWORD_RESET");
      if (email) redirectSearchParams.set("identifier", email);
      redirectSearchParams.set("redirectTo", "/app/settings/account/general");
      router.replace(`/auth/otp?${redirectSearchParams.toString()}`);
    } catch (e) {
      setServerError({
        title: t("auth.forgotPassword.hints.linkNotSent.title"),
        message: t("auth.forgotPassword.hints.linkNotSent.message"),
      });
    }
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold">
        {t("auth.forgotPassword.title")}
      </h1>
      <p className="text-muted-foreground mb-6 mt-4">
        {t("auth.forgotPassword.message")}{" "}
        <Link href="/auth/login">
          {t("auth.forgotPassword.backToSignin")} &rarr;
        </Link>
      </p>

      <form
        className="flex flex-col items-stretch gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label htmlFor="email" className="mb-1 block font-semibold">
            {t("auth.forgotPassword.email")}
          </label>
          <Input
            type="email"
            {...register("email", { required: true })}
            required
            autoComplete="email"
          />
        </div>

        {isSubmitted && serverError && (
          <Alert variant="error">
            <Icon.warning className="h-4 w-4" />
            <AlertTitle>{serverError.title}</AlertTitle>
            <AlertDescription>{serverError.message}</AlertDescription>
          </Alert>
        )}

        <Button loading={isSubmitting}>
          <Icon.submit className="mr-2 h-4 w-4" />{" "}
          {t("auth.forgotPassword.submit")}
        </Button>
      </form>
    </>
  );
}
