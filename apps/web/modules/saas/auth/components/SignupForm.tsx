"use client";

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
import { TeamInvitationInfo } from "./TeamInvitationInfo";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

type FormValues = z.infer<typeof formSchema>;

export function SignupForm() {
  const t = useTranslations();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, isSubmitSuccessful, errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const [serverError, setServerError] = useState<null | {
    title: string;
    message: string;
  }>(null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  const signupMutation = apiClient.auth.signup.useMutation();

  const invitationCode = searchParams.get("invitationCode");
  const redirectTo = invitationCode
    ? `/team/invitation?code=${invitationCode}`
    : searchParams.get("redirectTo") ?? "/app";
  const email = searchParams.get("email");

  useEffect(() => {
    if (email) setValue("email", email);
  }, [email]);

  const onSubmit: SubmitHandler<FormValues> = async ({
    email,
    password,
    name,
  }) => {
    setServerError(null);
    try {
      await signupMutation.mutateAsync({
        email,
        password,
        name,
        callbackUrl: new URL("/auth/verify", window.location.origin).toString(),
      });

      const redirectSearchParams = new URLSearchParams();
      redirectSearchParams.set("type", "SIGNUP");
      redirectSearchParams.set("redirectTo", redirectTo);
      if (invitationCode)
        redirectSearchParams.set("invitationCode", invitationCode);
      if (email) redirectSearchParams.set("identifier", email);

      router.replace(`/auth/otp?${redirectSearchParams.toString()}`);
    } catch (e) {
      setServerError({
        title: t("auth.signup.hints.signupFailed.title"),
        message: t("auth.signup.hints.signupFailed.message"),
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("auth.signup.title")}</h1>
      <p className="text-muted-foreground mb-6 mt-2">
        {t("auth.signup.message")}
      </p>

      {invitationCode && <TeamInvitationInfo className="mb-6" />}

      <form
        className="flex flex-col items-stretch gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isSubmitted && serverError && (
          <Alert variant="error">
            <Icon.warning className="h-4 w-4" />
            <AlertTitle>{serverError.title}</AlertTitle>
            <AlertDescription>{serverError.message}</AlertDescription>
          </Alert>
        )}

        <div>
          <label htmlFor="name" className="mb-1 block font-semibold">
            {t("auth.signup.name")} *
          </label>
          <Input
            type="text"
            {...register("name", { required: true })}
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block font-semibold">
            {t("auth.signup.email")} *
          </label>
          <Input
            // status={errors.email ? "error" : "default"}
            type="email"
            {...register("email", { required: true })}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block font-semibold">
            {t("auth.signup.password")} *
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              className="pr-10"
              // status={errors.password ? "error" : "default"}
              {...register("password", { required: true, minLength: 8 })}
              required
              autoComplete="new-password"
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
          <small className="italic opacity-50">
            {t("auth.signup.passwordHint")}
          </small>
        </div>

        <Button loading={isSubmitting}>{t("auth.signup.submit")} &rarr;</Button>

        <div>
          <span className="text-muted-foreground">
            {t("auth.signup.alreadyHaveAccount")}{" "}
          </span>
          <Link
            href={`/auth/login${
              invitationCode
                ? `?invitationCode=${invitationCode}&email=${email}`
                : ""
            }`}
          >
            {t("auth.signup.signIn")} &rarr;
          </Link>
        </div>
      </form>
    </div>
  );
}
