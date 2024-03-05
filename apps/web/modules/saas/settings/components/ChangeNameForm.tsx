"use client";

import { useUser } from "@saas/auth/hooks/use-user";
import { ActionBlock } from "@saas/shared/components/ActionBlock";
import { apiClient } from "@shared/lib/api-client";
import { Input } from "@ui/components/input";
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ChangeNameForm({ initialValue }: { initialValue: string }) {
  const [name, setName] = useState(initialValue ?? "");
  const { reloadUser } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();

  const updateUserMutation = apiClient.auth.update.useMutation({
    onSuccess: async () => {
      toast({
        variant: "success",
        title: t("settings.notifications.nameUpdated"),
      });
      await reloadUser();
      router.refresh();
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: t("settings.notifications.nameUpdateFailed"),
      });
    },
  });

  return (
    <ActionBlock
      title={t("settings.account.changeName.title")}
      onSubmit={() => updateUserMutation.mutate({ name })}
      isSubmitting={updateUserMutation.isPending}
      isSubmitDisabled={!name || name.length < 3 || name === initialValue}
    >
      <Input
        type="text"
        className="max-w-sm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </ActionBlock>
  );
}
