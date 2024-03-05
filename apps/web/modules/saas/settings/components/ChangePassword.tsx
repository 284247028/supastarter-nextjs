"use client";

import { ActionBlock } from "@saas/shared/components/ActionBlock";
import { apiClient } from "@shared/lib/api-client";
import { PasswordInput } from "@ui/components/password-input";
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ChangePasswordForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const [password, setPassword] = useState("");

  const changePasswordMutation = apiClient.auth.changePassword.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        title: t("settings.notifications.passwordUpdated"),
      });
      setPassword("");
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: t("settings.notifications.passwordNotUpdated"),
      });
    },
  });

  return (
    <ActionBlock
      title={t("settings.account.changePassword.title")}
      onSubmit={() => changePasswordMutation.mutate({ password })}
      isSubmitting={changePasswordMutation.isPending}
      isSubmitDisabled={!password || password.length < 8}
    >
      <PasswordInput
        className="max-w-sm"
        value={password}
        onChange={(value) => setPassword(value)}
      />
    </ActionBlock>
  );
}
