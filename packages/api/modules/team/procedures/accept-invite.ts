import { TRPCError } from "@trpc/server";
import { TeamSchema, db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const acceptInvitation = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(TeamSchema.pick({ name: true }))
  .mutation(async ({ input: { id }, ctx: { user } }) => {
    const invitation = await db.teamInvitation.findFirst({
      where: {
        id,
      },
    });

    if (!invitation)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Invitation not found.",
      });

    if (invitation.expiresAt < new Date())
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Invitation expired.",
      });

    // create membership for user
    const { team } = await db.teamMembership.create({
      data: {
        teamId: invitation.teamId,
        userId: user.id,
        role: invitation.role,
      },
      include: {
        team: {
          select: {
            name: true,
          },
        },
      },
    });

    // delete invitation
    await db.teamInvitation.delete({
      where: {
        id,
      },
    });

    return team;
  });
