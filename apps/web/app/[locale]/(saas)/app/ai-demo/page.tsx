import { ProductNameGenerator } from "@saas/dashboard/components/ProductNameGenerator";
import { PageHeader } from "@saas/shared/components/PageHeader";

export default function AiDemoPage() {
  return (
    <div className="container max-w-6xl py-8">
      <PageHeader
        title="AI Demo"
        subtitle="This demo shows an example integration of the OpenAI API"
      />
      <div className="bg-card text-foreground mx-auto max-w-3xl rounded-lg border p-8">
        <div>
          <p className="mb-4">
            Enter a topic and we will generate some funny product names for you:
          </p>
          <ProductNameGenerator />
        </div>
      </div>
    </div>
  );
}
