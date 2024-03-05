import { ChangeNameForm } from "@saas/settings/components/ChangeNameForm";
import { ChangePasswordForm } from "@saas/settings/components/ChangePassword";
import { DeleteAccountForm } from "@saas/settings/components/DeleteAccountForm";
import { UserAvatarForm } from "@saas/settings/components/UserAvatarForm";
import { createApiCaller } from "api/trpc/caller";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("settings.account.title"),
  };
}

export default async function AccountSettingsPage() {
  const apiCaller = await createApiCaller();
  const user = await apiCaller.auth.user();

  if (!user) redirect("/auth/login");

  return (
    <div className="grid gap-6">
      <UserAvatarForm />
      <ChangeNameForm initialValue={user.name ?? ""} />
      <ChangePasswordForm />
      <DeleteAccountForm />
    </div>
  );
}
