"use client";

import { useLocaleCurrency } from "@shared/hooks/locale-currency";
import { Button } from "@ui/components/button";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs";
import { cn } from "@ui/lib";
import { ApiOutput } from "api/trpc/router";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type SubscriptionPlan = ApiOutput["billing"]["plans"][number] & {
  features?: Array<string>;
};

export function PricingTable({
  plans,
  activePlanId,
  onSelectPlan,
  labels,
  className,
}: {
  plans: SubscriptionPlan[];
  activePlanId?: string;
  onSelectPlan: (planId: string, variantId: string) => void | Promise<void>;
  className?: string;
  labels: {
    yearly: string;
    monthly: string;
    month: string;
    year: string;
    subscribe: string;
    currentPlan?: string;
    switchToPlan?: string;
  };
}) {
  const t = useTranslations();
  const localeCurrency = useLocaleCurrency();
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const sortedAndFilteredPlans = useMemo(() => {
    return [...plans]
      .map((plan) => {
        const variants = plan.variants
          .filter(
            (v) =>
              v.interval === interval &&
              v.currency.toLowerCase() === localeCurrency.toLowerCase(),
          )
          .sort((a, b) => a.price - b.price);

        return {
          ...plan,
          variants,
        };
      })
      .filter((plan) => plan.variants.length > 0)
      .sort((a, b) => {
        const lowestPriceA = a.variants.reduce(
          (lowest, variant) => Math.min(lowest, variant.price),
          Infinity,
        );
        const lowestPriceB = b.variants.reduce(
          (lowest, variant) => Math.min(lowest, variant.price),
          Infinity,
        );

        return lowestPriceA - lowestPriceB;
      });
  }, [plans, interval]);

  const isActivePlan = (plan: (typeof plans)[number]) => {
    return activePlanId === plan.id;
  };

  return (
    <div className={cn(className, "@container")}>
      <div className="flex justify-end">
        <Tabs
          value={interval}
          onValueChange={(value) => setInterval(value as typeof interval)}
          className="mb-4"
          data-test="price-table-interval-tabs"
        >
          <TabsList>
            <TabsTrigger value="month">{labels.monthly}</TabsTrigger>
            <TabsTrigger value="year">{labels.yearly}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="@md:grid-cols-3 grid gap-4">
        {sortedAndFilteredPlans.map((plan) => {
          const variant = plan.variants.find((v) => v.interval === interval);

          if (!variant) return null;

          return (
            <div
              key={plan.id}
              className="rounded-xl border p-6"
              data-test="price-table-plan"
            >
              <div className="flex h-full flex-col justify-between gap-4">
                <div>
                  <h3 className="mb-4 text-2xl font-bold">{plan.name}</h3>
                  {plan.description && (
                    <div
                      className="prose text-muted-foreground mb-2"
                      dangerouslySetInnerHTML={{ __html: plan.description }}
                    />
                  )}

                  {!!plan.features?.length && (
                    <ul className="text-muted-foreground grid list-disc gap-2 pl-4">
                      {plan.features.map((feature, key) => (
                        <li key={key}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <strong
                    className="text-primary text-2xl font-bold"
                    data-test="price-table-plan-price"
                  >
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: variant.currency,
                    }).format(variant.price / 100)}
                    <span className="text-sm font-normal opacity-70">
                      {" / "}
                      {labels[interval]}
                    </span>
                  </strong>

                  <Button
                    disabled={isActivePlan(plan)}
                    loading={selectedPlan === plan.id}
                    className="mt-4 w-full"
                    onClick={async () => {
                      setSelectedPlan(plan.id);
                      await onSelectPlan(plan.id, String(variant.id));
                      setSelectedPlan(null);
                    }}
                  >
                    {isActivePlan(plan)
                      ? labels.currentPlan
                      : activePlanId
                        ? labels.switchToPlan
                        : labels.subscribe}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
