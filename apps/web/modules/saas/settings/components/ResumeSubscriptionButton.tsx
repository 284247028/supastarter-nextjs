"use client";

import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function ResumeSubscriptionButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const resumeSubscriptionMutation =
    apiClient.billing.resumeSubscription.useMutation({
      onSuccess: () => {
        toast({
          variant: "success",
          title: t(
            "settings.billing.resumeSubscription.notifications.success.title",
          ),
        });
        router.refresh();
      },
      onError: () => {
        toast({
          variant: "error",
          title: t(
            "settings.billing.resumeSubscription.notifications.error.title",
          ),
        });
      },
    });

  const resumeSubscription = async () => {
    try {
      await resumeSubscriptionMutation.mutateAsync({ id });
    } catch {}
  };

  return (
    <Button
      variant="outline"
      onClick={() => resumeSubscription()}
      loading={resumeSubscriptionMutation.isPending}
    >
      <Icon.undo className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
