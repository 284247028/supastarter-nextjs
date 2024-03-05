"use client";

import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function CancelSubscriptionButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const cancelSubscriptionMutation =
    apiClient.billing.cancelSubscription.useMutation({
      onSuccess: () => {
        toast({
          variant: "success",
          title: t(
            "settings.billing.cancelSubscription.notifications.success.title",
          ),
        });
        router.refresh();
      },
      onError: () => {
        toast({
          variant: "error",
          title: t(
            "settings.billing.cancelSubscription.notifications.error.title",
          ),
        });
      },
    });

  const cancelSubscription = async () => {
    try {
      await cancelSubscriptionMutation.mutateAsync({ id });
    } catch {}
  };

  return (
    <Button
      variant="outline"
      onClick={() => cancelSubscription()}
      loading={cancelSubscriptionMutation.isPending}
    >
      <Icon.close className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
