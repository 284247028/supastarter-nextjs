"use client";

import { useUser } from "@saas/auth/hooks/use-user";
import { updateCurrentTeamIdCookie } from "@saas/auth/lib/current-team-id";
import { createTeamDialogOpen } from "@saas/dashboard/state";
import { TeamAvatar } from "@shared/components/TeamAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Icon } from "@ui/components/icon";
import { Team } from "database";
import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { CreateTeamDialog } from "./CreateTeamDialog";

export function TeamSelect({
  teams,
  className,
}: {
  teams: Team[];
  className?: string;
}) {
  const t = useTranslations();
  const setCreateTeamDialogOpen = useSetAtom(createTeamDialogOpen);
  const { teamMembership } = useUser();
  const activeTeam = teams.find((team) => team.id === teamMembership?.teamId);

  const switchTeam = (teamId: string) => {
    if (!activeTeam) return;

    updateCurrentTeamIdCookie(teamId);
    location.reload();
  };

  if (!activeTeam) return null;

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-ring focus-visible:border-primary -ml-2 flex w-full items-center justify-between rounded-md px-2 py-2 text-left outline-none focus-visible:ring-1">
          <div className="flex items-center justify-start gap-2 text-sm">
            <span className="hidden lg:block">
              <TeamAvatar
                name={activeTeam.name}
                avatarUrl={activeTeam.avatarUrl}
              />
            </span>
            <span className="block flex-1 truncate">{activeTeam.name}</span>
            <Icon.select className="block h-4 w-4 opacity-50" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuRadioGroup
            value={activeTeam.id}
            onValueChange={switchTeam}
          >
            {teams.map((team) => (
              <DropdownMenuRadioItem
                key={team.id}
                value={team.id}
                className="flex items-center justify-center gap-2"
              >
                <div className="flex flex-1 items-center justify-start gap-2">
                  <TeamAvatar
                    className="size-6"
                    name={activeTeam.name}
                    avatarUrl={activeTeam.avatarUrl}
                  />
                  {team.name}
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setCreateTeamDialogOpen(true)}>
              <Icon.plus className="mr-2 h-4 w-4" />
              {t("dashboard.sidebar.createTeam")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateTeamDialog />
    </div>
  );
}
