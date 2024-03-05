import { SubscriptionStatusType } from "database";
import { z } from "zod";

export type GetAllPlans = () => Promise<SubscriptionPlan[]>;

export type CreateCheckoutLink = (params: {
  planId: string;
  variantId: string;
  email?: string;
  name?: string;
  teamId: string;
  redirectUrl?: string;
}) => Promise<string>;

export type CreateCustomerPortalLink = (params: {
  subscriptionId: string;
  customerId: string;
  redirectUrl?: string;
}) => Promise<string>;

export type PauseSubscription = (params: { id: string }) => Promise<void>;

export type CancelSubscription = (params: { id: string }) => Promise<void>;

export type ResumeSubscription = (params: { id: string }) => Promise<{
  status: SubscriptionStatusType;
}>;

export const SubscriptionPlanVariantModel = z.object({
  id: z.string(),
  price: z.number(),
  currency: z.string(),
  interval: z.string(),
  interval_count: z.number(),
});

export const SubscriptionPlanModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  storeId: z.string().nullable().optional(),
  variants: z.array(SubscriptionPlanVariantModel),
});

export type SubscriptionPlan = z.infer<typeof SubscriptionPlanModel>;
export type SubscriptionPlanVariant = z.infer<
  typeof SubscriptionPlanVariantModel
>;
