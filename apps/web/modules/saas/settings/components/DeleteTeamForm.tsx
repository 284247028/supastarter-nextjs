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

export function DeleteTeamForm({ teamId }: { teamId: string }) {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const deleteTeamMutation = apiClient.team.deleteTeam.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        title: t("settings.notifications.teamDeleted"),
      });
      router.replace("/");
    },
    onError: () => {
      toast({
        variant: "error",
        title: t("settings.notifications.teamNotDeleted"),
      });
    },
  });

  return (
    <>
      <ActionBlock
        danger
        title={t("settings.team.deleteTeam.title")}
        onSubmit={() => setShowConfirmation(true)}
        submitLabel={t("settings.team.deleteTeam.submit")}
      >
        <p>{t("settings.team.deleteTeam.description")}</p>
      </ActionBlock>

      <AlertDialog
        open={showConfirmation}
        onOpenChange={(open) => setShowConfirmation(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              {t("settings.team.deleteTeam.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("settings.team.deleteTeam.confirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("common.confirmation.cancel")}
            </AlertDialogCancel>
            <Button
              variant="error"
              loading={deleteTeamMutation.isPending}
              onClick={async () => {
                await deleteTeamMutation.mutateAsync({
                  id: teamId,
                });
                window.location.reload();
              }}
            >
              {t("settings.team.deleteTeam.submit")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
