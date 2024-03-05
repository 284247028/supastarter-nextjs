import { TRPCError } from "@trpc/server";
import { TeamMembershipSchema, db } from "database";
import { protectedProcedure } from "../../../trpc/base";

export const updateMembership = protectedProcedure
  .input(
    TeamMembershipSchema.pick({
      id: true,
      role: true,
    }),
  )
  .mutation(async ({ input: { id, role }, ctx: { abilities, isAdmin } }) => {
    const membership = await db.teamMembership.findUnique({
      where: {
        id,
      },
    });

    if (!membership)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Membership not found.",
      });

    // user can only remove themselves from a team if they are not the owner
    if (!isAdmin && !abilities.isTeamOwner(membership.teamId))
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No permission to remove a member from this team.",
      });

    try {
      await db.teamMembership.update({
        where: {
          id: membership.id,
        },
        data: {
          role,
        },
      });
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not update member.",
      });
    }
  });
