import { PricingTable } from "@marketing/pricing/components/PricingTable";
import { createApiCaller } from "api/trpc/caller";
import { getTranslations } from "next-intl/server";

export default async function PricingPage() {
  const apiCaller = await createApiCaller();
  const plans = await apiCaller.billing.plans();
  const t = await getTranslations();

  return (
    <main>
      <div className="px-8 pb-24 pt-12">
        <div className="container">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold lg:text-5xl">
              {t("pricing.title")}
            </h1>
            <p className="mt-3 text-lg opacity-50">
              {t("pricing.description")}
            </p>
          </div>

          <div className="container max-w-4xl">
            <PricingTable plans={plans} />
          </div>
        </div>
      </div>
    </main>
  );
}
