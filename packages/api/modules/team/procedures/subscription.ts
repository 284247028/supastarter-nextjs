import { SubscriptionSchema, db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const subscription = protectedProcedure
  .input(
    z.object({
      teamId: z.string(),
    }),
  )
  .output(SubscriptionSchema.nullable())
  .query(async ({ input: { teamId }, ctx: { abilities } }) => {
    if (!abilities.isTeamMember(teamId)) throw new Error("Unauthorized");

    const subscription = await db.subscription.findFirst({
      where: {
        teamId,
      },
    });

    return subscription;
  });
