"use client";

import { Badge, BadgeProps } from "@ui/components/badge";
import { SubscriptionStatusType } from "database";
import { useTranslations } from "next-intl";

export function SubscriptionStatusBadge({
  status,
}: {
  status: SubscriptionStatusType;
  className?: string;
}) {
  const t = useTranslations();

  const badgeLabels: Record<SubscriptionStatusType, string> = {
    ACTIVE: t("settings.billing.subscription.status.active"),
    CANCELED: t("settings.billing.subscription.status.canceled"),
    EXPIRED: t("settings.billing.subscription.status.expired"),
    INCOMPLETE: t("settings.billing.subscription.status.incomplete"),
    PAST_DUE: t("settings.billing.subscription.status.past_due"),
    PAUSED: t("settings.billing.subscription.status.paused"),
    TRIALING: t("settings.billing.subscription.status.trialing"),
    UNPAID: t("settings.billing.subscription.status.unpaid"),
  };

  const badgeColors: Record<SubscriptionStatusType, BadgeProps["status"]> = {
    ACTIVE: "success",
    CANCELED: "error",
    EXPIRED: "error",
    INCOMPLETE: "warning",
    PAST_DUE: "warning",
    PAUSED: "warning",
    TRIALING: "info",
    UNPAID: "error",
  };

  return <Badge status={badgeColors[status]}>{badgeLabels[status]}</Badge>;
}
