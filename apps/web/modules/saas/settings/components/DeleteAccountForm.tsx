"use client";

import { ActionBlock } from "@saas/shared/components/ActionBlock";
import { apiClient } from "@shared/lib/api-client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/components/alert-dialog";
import { Button } from "@ui/components/button";
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteAccountForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const deleteAccountMutation = apiClient.auth.deleteAccount.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        title: t("settings.notifications.accountDeleted"),
      });
      router.replace("/");
    },
    onError: () => {
      toast({
        variant: "error",
        title: t("settings.notifications.accountNotDeleted"),
      });
    },
  });

  return (
    <>
      <ActionBlock
        danger
        title={t("settings.account.deleteAccount.title")}
        onSubmit={() => setShowConfirmation(true)}
        submitLabel={t("settings.account.deleteAccount.submit")}
      >
        <p>{t("settings.account.deleteAccount.description")}</p>
      </ActionBlock>

      <AlertDialog
        open={showConfirmation}
        onOpenChange={(open) => setShowConfirmation(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              {t("settings.account.deleteAccount.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("settings.account.deleteAccount.confirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("common.confirmation.cancel")}
            </AlertDialogCancel>
            <Button
              variant="error"
              loading={deleteAccountMutation.isPending}
              onClick={async () => {
                await deleteAccountMutation.mutateAsync();
                setShowConfirmation(false);
              }}
            >
              {t("settings.account.deleteAccount.submit")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
