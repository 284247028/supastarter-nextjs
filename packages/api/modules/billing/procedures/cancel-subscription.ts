import { TRPCError } from "@trpc/server";
import { db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";
import { cancelSubscription as cancelSubscriptionResolver } from "../provider";

export const cancelSubscription = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input: { id }, ctx: { abilities } }) => {
    const subscription = await db.subscription.findFirst({
      where: {
        id,
      },
    });

    if (!subscription)
      throw new TRPCError({
        code: "NOT_FOUND",
      });

    if (!abilities.isTeamOwner(subscription.teamId))
      throw new TRPCError({
        code: "FORBIDDEN",
      });

    try {
      await cancelSubscriptionResolver({ id });

      await db.subscription.update({
        where: {
          id: id,
        },
        data: {
          status: "CANCELED",
        },
      });
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });
