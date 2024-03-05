"use client";

import { appConfig } from "@config";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@shared/lib/api-client";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import { Input } from "@ui/components/input";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "../hooks/use-user";
import SigninModeSwitch from "./SigninModeSwitch";
import { SocialSigninButton } from "./SocialSigninButton";
import { TeamInvitationInfo } from "./TeamInvitationInfo";

const formSchema = z.object({
  email: z.string().email(),
  password: z.optional(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const { user, loaded } = useUser();
  const [signinMode, setSigninMode] = useState<"password" | "magic-link">(
    "magic-link",
  );
  const [serverError, setServerError] = useState<null | {
    title: string;
    message: string;
  }>(null);
  const searchParams = useSearchParams();

  const loginWithPasswordMutation =
    apiClient.auth.loginWithPassword.useMutation();
  const loginWithEmailMutation = apiClient.auth.loginWithEmail.useMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, isSubmitted },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  const invitationCode = searchParams.get("invitationCode");
  const redirectTo = invitationCode
    ? `/team/invitation?code=${invitationCode}`
    : searchParams.get("redirectTo") ?? "/app";
  const email = searchParams.get("email");

  useEffect(() => {
    if (email) setValue("email", email);
  }, [email]);

  useEffect(() => {
    reset();
    setServerError(null);
  }, [signinMode]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const onSubmit: SubmitHandler<FormValues> = async ({ email, password }) => {
    setServerError(null);
    try {
      if (signinMode === "password") {
        await loginWithPasswordMutation.mutateAsync({
          email,
          password: password!,
        });

        handleRedirect();
      } else {
        await loginWithEmailMutation.mutateAsync({
          email,
          callbackUrl: new URL(
            "/auth/verify",
            window.location.origin,
          ).toString(),
        });

        const redirectSearchParams = new URLSearchParams();
        redirectSearchParams.set("type", "LOGIN");
        redirectSearchParams.set("redirectTo", redirectTo);
        if (invitationCode)
          redirectSearchParams.set("invitationCode", invitationCode);
        if (email) redirectSearchParams.set("identifier", email);
        router.replace(`/auth/otp?${redirectSearchParams.toString()}`);
      }
    } catch (e) {
      setServerError({
        title: t("auth.login.hints.invalidCredentials.title"),
        message: t("auth.login.hints.invalidCredentials.message"),
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold">{t("auth.login.title")}</h1>
      <p className="text-muted-foreground mb-6 mt-4">
        {t("auth.login.subtitle")}
      </p>

      {invitationCode && <TeamInvitationInfo className="mb-6" />}

      <div className="flex flex-col items-stretch gap-3">
        {appConfig.auth.oAuthProviders.map((providerId) => (
          <SocialSigninButton key={providerId} provider={providerId} />
        ))}
      </div>

      <hr className=" my-8" />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <SigninModeSwitch
          className="w-full"
          activeMode={signinMode}
          onChange={(value) => setSigninMode(value as typeof signinMode)}
        />
        {isSubmitted && serverError && (
          <Alert variant="error">
            <Icon.warning className="h-4 w-4" />
            <AlertTitle>{serverError.title}</AlertTitle>
            <AlertDescription>{serverError.message}</AlertDescription>
          </Alert>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block font-semibold">
            {t("auth.login.email")}
          </label>
          <Input
            type="email"
            {...register("email", { required: true })}
            required
            autoComplete="email"
          />
        </div>
        {signinMode === "password" && (
          <div>
            <label htmlFor="password" className="mb-1 block font-semibold">
              {t("auth.login.password")}
            </label>
            <Input
              type="password"
              {...register("password", { required: true })}
              required
              autoComplete="current-password"
            />
            <div className="mt-1 text-right text-sm">
              <Link href="/auth/forgot-password">
                {t("auth.login.forgotPassword")}
              </Link>
            </div>
          </div>
        )}
        <Button className="w-full" type="submit" loading={isSubmitting}>
          {signinMode === "password"
            ? t("auth.login.submit")
            : t("auth.login.sendMagicLink")}
        </Button>

        <div>
          <span className="text-muted-foreground">
            {t("auth.login.dontHaveAnAccount")}{" "}
          </span>
          <Link
            href={`/auth/signup${
              invitationCode
                ? `?invitationCode=${invitationCode}&email=${email}`
                : ""
            }`}
          >
            {t("auth.login.createAnAccount")} &rarr;
          </Link>
        </div>
      </form>
    </div>
  );
}
