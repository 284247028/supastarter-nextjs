import { TRPCError } from "@trpc/server";
import { TeamMembershipSchema, UserSchema, db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const memberships = protectedProcedure
  .input(
    z.object({
      teamId: z.string(),
    }),
  )
  .output(
    z.array(
      TeamMembershipSchema.merge(
        z.object({
          user: UserSchema.optional(),
        }),
      ),
    ),
  )
  .query(async ({ input: { teamId }, ctx: { abilities } }) => {
    if (!abilities.isTeamMember(teamId)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No permission to read the memberships for this team.",
      });
    }

    const memberships = await db.teamMembership.findMany({
      where: {
        teamId,
      },
    });

    const userIds =
      memberships.map((m) => m.userId).filter((id): id is string => !!id) ?? [];

    const users = await db.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    return (
      memberships.map((m) => ({
        ...m,
        user: users.find((u) => u.id === m.userId),
      })) ?? []
    );
  });
