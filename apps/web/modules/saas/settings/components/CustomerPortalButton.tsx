"use client";

import { apiClient } from "@shared/lib/api-client";
import { Button } from "@ui/components/button";
import { Icon } from "@ui/components/icon";
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";

export function CustomerPortalButton({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  const t = useTranslations();
  const { toast } = useToast();
  const createCustomerPortalMutation =
    apiClient.billing.createCustomerPortalLink.useMutation({
      onError: () => {
        toast({
          variant: "error",
          title: t(
            "settings.billing.createCustomerPortal.notifications.error.title",
          ),
        });
      },
    });

  const createCustomerPortal = async () => {
    try {
      const url = await createCustomerPortalMutation.mutateAsync({
        subscriptionId,
        redirectUrl: window.location.href,
      });

      window.location.href = url;
    } catch {}
  };

  return (
    <Button
      variant="default"
      onClick={() => createCustomerPortal()}
      loading={createCustomerPortalMutation.isPending}
    >
      <Icon.creditCard className="mr-2 h-4 w-4" />
      {t("settings.billing.createCustomerPortal.label")}
    </Button>
  );
}
