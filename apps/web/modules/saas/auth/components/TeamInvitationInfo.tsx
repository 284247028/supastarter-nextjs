import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Icon } from "@ui/components/icon";
import { useTranslations } from "next-intl";

export function TeamInvitationInfo({ className }: { className?: string }) {
  const t = useTranslations();
  return (
    <Alert variant="primary" className={className}>
      <Icon.invitation className="h-4 w-4" />
      <AlertTitle>{t("auth.teamInvitation.title")}</AlertTitle>
      <AlertDescription>
        {t("auth.teamInvitation.description")}
      </AlertDescription>
    </Alert>
  );
}
