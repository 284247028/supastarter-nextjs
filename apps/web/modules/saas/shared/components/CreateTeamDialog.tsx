"use client";

import { updateCurrentTeamIdCookie } from "@saas/auth/lib/current-team-id";
import { createTeamDialogOpen } from "@saas/dashboard/state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ui/components/dialog";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CreateTeamForm } from "./CreateTeamForm";

export function CreateTeamDialog() {
  const t = useTranslations();
  const [open, setOpen] = useAtom(createTeamDialogOpen);
  const router = useRouter();

  const switchTeam = (teamId: string) => {
    updateCurrentTeamIdCookie(teamId);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createTeam.title")}</DialogTitle>
        </DialogHeader>

        <CreateTeamForm
          onSuccess={async (team) => {
            switchTeam(team.id);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
