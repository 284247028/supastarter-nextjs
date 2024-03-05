import { SubscriptionOverview } from "@saas/settings/components/SubscriptionOverview";
import { UpgradePlan } from "@saas/settings/components/UpgradePlan";
import { CURRENT_TEAM_ID_COOKIE_NAME } from "@saas/shared/constants";
import { createApiCaller } from "api/trpc/caller";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations();

  return {
    title: t("settings.billing.title"),
  };
}

export default async function BillingSettingsPage() {
  const apiCaller = await createApiCaller();
  const plans = await apiCaller.billing.plans();
  const user = await apiCaller.auth.user();
  const currentTeamId = cookies().get(CURRENT_TEAM_ID_COOKIE_NAME)
    ?.value as string;

  if (!user) redirect("/auth/login");

  const { teamMemberships } = user;

  const { team } =
    teamMemberships!.find(
      (membership) => membership.team.id === currentTeamId,
    ) ?? teamMemberships![0];

  const teamSubscription = await apiCaller.team.subscription({
    teamId: team.id,
  });

  return (
    <div>
      <SubscriptionOverview
        plans={plans}
        currentSubscription={teamSubscription}
        className="mb-4"
      />
      <UpgradePlan
        plans={plans}
        activePlanId={teamSubscription?.planId}
        teamId={team.id}
      />
    </div>
  );
}
