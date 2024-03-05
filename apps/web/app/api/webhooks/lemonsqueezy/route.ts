import { createAdminApiCaller } from "api/trpc/caller";
import { createHmac, timingSafeEqual } from "crypto";
import { SubscriptionStatusType } from "database";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const hmac = createHmac(
      "sha256",
      process.env.LEMONSQUEEZY_WEBHOOK_SECRET as string,
    );
    const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
    const signature = Buffer.from(
      headers().get("x-signature") as string,
      "utf8",
    );

    if (!timingSafeEqual(digest, signature))
      return new Response("Invalid signature.", {
        status: 400,
      });

    const payload = JSON.parse(text);

    const {
      meta: { event_name: eventName, custom_data: customData },
      data,
    } = payload;

    const statusMap: Record<string, SubscriptionStatusType> = {
      active: "ACTIVE",
      past_due: "PAST_DUE",
      unpaid: "UNPAID",
      cancelled: "CANCELED",
      expired: "EXPIRED",
      on_trial: "TRIALING",
      paused: "PAUSED",
    };

    const apiCaller = await createAdminApiCaller();

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated":
      case "subscription_cancelled":
      case "subscription_expired":
      case "subscription_resumed":
        await apiCaller.billing.syncSubscription({
          id: String(data.id),
          teamId: customData?.team_id,
          customerId: String(data.attributes.customer_id),
          planId: String(data.attributes.product_id),
          variantId: String(data.attributes.variant_id),
          status: statusMap[data.attributes.status],
          nextPaymentDate: new Date(
            data.attributes.trial_ends_at ?? data.attributes.renews_at,
          ),
        });
        break;
    }
  } catch (error: unknown) {
    return new Response(
      `Webhook error: ${error instanceof Error ? error.message : ""}`,
      {
        status: 400,
      },
    );
  }

  return new Response(null, {
    status: 204,
  });
}
