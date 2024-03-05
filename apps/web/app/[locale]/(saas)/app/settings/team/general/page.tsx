import { ChangeTeamNameForm } from "@saas/settings/components/ChangeTeamNameForm";
import { DeleteTeamForm } from "@saas/settings/components/DeleteTeamForm";
import { TeamAvatarForm } from "@saas/settings/components/TeamAvatarForm";
import { CURRENT_TEAM_ID_COOKIE_NAME } from "@saas/shared/constants";
import { createApiCaller } from "api/trpc/caller";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("settings.team.title"),
  };
}

export default async function TeamSettingsPage() {
  const apiCaller = await createApiCaller();
  const user = await apiCaller.auth.user();
  const currentTeamId = cookies().get(CURRENT_TEAM_ID_COOKIE_NAME)
    ?.value as string;

  if (!user) redirect("/auth/login");

  const { teamMemberships } = user;

  const { team } =
    teamMemberships!.find(
      (membership) => membership.team.id === currentTeamId,
    ) ?? teamMemberships![0];

  return (
    <div className="grid grid-cols-1 gap-6">
      <TeamAvatarForm />
      <ChangeTeamNameForm initialValue={team.name} teamId={team.id} />
      <DeleteTeamForm teamId={team.id} />
    </div>
  );
}
