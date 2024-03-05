import {
  CancelSubscription,
  CreateCheckoutLink,
  CreateCustomerPortalLink,
  GetAllPlans,
  PauseSubscription,
  ResumeSubscription,
  SubscriptionPlan,
} from "../../types";
import { callLemonsqueezyApi } from "./api";

export const getAllPlans: GetAllPlans = async function () {
  const response = await callLemonsqueezyApi(
    "/products?include=variants,store",
  );

  return response.data
    .map((product: any): SubscriptionPlan => {
      const store = response.included.find(
        (item: any) =>
          item.type === "stores" &&
          Number(product.attributes.store_id) === Number(item.id),
      );
      const currency = store.attributes.currency ?? "USD";

      return {
        id: product.id,
        name: product.attributes.name,
        description: product.attributes.description,
        storeId: String(store.id),
        variants: response.included
          .filter(
            (item: any) =>
              item.type === "variants" &&
              item.attributes.is_subscription &&
              Number(item.attributes.product_id) === Number(product.id),
          )
          .map((variant: any) => ({
            id: variant.id,
            interval: variant.attributes.interval,
            interval_count: variant.attributes.interval_count,
            price: variant.attributes.price,
            currency,
          })),
      };
    })
    .filter((product: any) => product.variants.length > 0);
};

export const createCheckoutLink: CreateCheckoutLink = async function ({
  variantId,
  email,
  name,
  teamId,
  redirectUrl,
}) {
  const response = await callLemonsqueezyApi("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            enabled_variants: [variantId],
            redirect_url: redirectUrl,
          },
          checkout_data: {
            email,
            name,
            custom: {
              team_id: teamId,
            },
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              // eslint-disable-next-line turbo/no-undeclared-env-vars
              id: String(process.env.LEMONSQUEEZY_STORE_ID),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: String(variantId),
            },
          },
        },
      },
    }),
  });

  return response.data.attributes.url;
};

export const createCustomerPortalLink: CreateCustomerPortalLink = async (
  params,
) => {
  const { subscriptionId } = params;

  const response = await callLemonsqueezyApi(
    `/subscriptions/${subscriptionId}`,
  );

  return response.data.attributes.urls.update_payment_method;
};

export const pauseSubscription: PauseSubscription = async (params) => {
  const { id } = params;

  await callLemonsqueezyApi(`/subscriptions/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "subscriptions",
        id,
        attributes: {
          pause: {
            mode: "free",
          },
        },
      },
    }),
  });
};

export const cancelSubscription: CancelSubscription = async (params) => {
  const { id } = params;

  await callLemonsqueezyApi(`/subscriptions/${id}`, {
    method: "DELETE",
  });
};

export const resumeSubscription: ResumeSubscription = async (params) => {
  const { id } = params;

  const response = await callLemonsqueezyApi(`/subscriptions/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "subscriptions",
        id,
        attributes: {
          cancelled: false,
        },
      },
    }),
  });

  return {
    status: response.data.attributes.status,
  };
};
