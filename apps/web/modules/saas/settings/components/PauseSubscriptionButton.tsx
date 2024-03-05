"use client";

import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function PauseSubscriptionButton({ id }: { id: string }) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const pauseSubscriptionMutation =
    apiClient.billing.pauseSubscription.useMutation({
      onSuccess: () => {
        toast({
          variant: "success",
          title: t(
            "settings.billing.pauseSubscription.notifications.success.title",
          ),
        });
        router.refresh();
      },
      onError: () => {
        toast({
          variant: "error",
          title: t(
            "settings.billing.pauseSubscription.notifications.error.title",
          ),
        });
      },
    });

  const pauseSubscription = async () => {
    try {
      await pauseSubscriptionMutation.mutateAsync({ id });
    } catch {}
  };

  return (
    <Button
      variant="outline"
      onClick={() => pauseSubscription()}
      loading={pauseSubscriptionMutation.isPending}
    >
      <Icon.pause className="mr-2 h-4 w-4" />
      {t("settings.billing.pauseSubscription.label")}
    </Button>
  );
}
