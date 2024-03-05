import { TRPCError } from "@trpc/server";
import { db } from "database";
import { z } from "zod";
import { adminProcedure } from "../../../trpc/base";

export const deleteUser = adminProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input: { id }, ctx: { responseHeaders, user } }) => {
    try {
      await db.user.delete({
        where: {
          id: user.id,
        },
      });

      await db.team.deleteMany({
        where: {
          memberships: {
            every: {
              userId: user.id,
            },
          },
        },
      });
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unknown error occurred.",
      });
    }
  });
