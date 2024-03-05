"use client";

import { PricingTable as PricingTablePrimitive } from "@shared/components/PricingTable";
import { ApiOutput } from "api/trpc/router";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function PricingTable({
  plans,
}: {
  plans: ApiOutput["billing"]["plans"];
}) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <PricingTablePrimitive
      plans={plans}
      onSelectPlan={() => {
        router.push("/app/settings/team/billing");
      }}
      labels={{
        year: t("pricing.year"),
        month: t("pricing.month"),
        yearly: t("pricing.yearly"),
        monthly: t("pricing.monthly"),
        subscribe: t("pricing.subscribe"),
      }}
    />
  );
}
