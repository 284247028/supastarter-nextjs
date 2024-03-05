import { TRPCError } from "@trpc/server";
import { db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const removeMember = protectedProcedure
  .input(
    z.object({
      membershipId: z.string(),
    }),
  )
  .mutation(async ({ input: { membershipId }, ctx: { abilities, user } }) => {
    const membership = await db.teamMembership.findUnique({
      where: {
        id: membershipId,
      },
    });

    if (!membership)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Membership not found.",
      });

    // user can only remove themselves from a team if they are not the owner
    if (
      !abilities.isTeamOwner(membership.teamId) &&
      membership.userId !== user.id
    )
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No permission to remove a member from this team.",
      });

    try {
      await db.teamMembership.delete({
        where: {
          id: membership.id,
        },
      });
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could remove member.",
      });
    }
  });
