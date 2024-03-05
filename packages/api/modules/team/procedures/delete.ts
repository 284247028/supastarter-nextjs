import { TRPCError } from "@trpc/server";
import { db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const deleteTeam = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(
    async ({ input: { id }, ctx: { responseHeaders, user, abilities } }) => {
      try {
        if (!abilities.isTeamOwner(id)) {
          throw new TRPCError({
            code: "FORBIDDEN",
          });
        }

        await db.team.delete({
          where: {
            id,
          },
        });
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unknown error occurred.",
        });
      }
    },
  );
