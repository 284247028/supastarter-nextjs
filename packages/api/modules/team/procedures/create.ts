import { TeamMemberRoleSchema, TeamSchema, db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const create = protectedProcedure
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .output(
    TeamSchema.extend({
      memberships: z.array(
        z.object({
          id: z.string(),
          role: TeamMemberRoleSchema,
          isCreator: z.boolean(),
        }),
      ),
    }),
  )
  .mutation(async ({ input: { name }, ctx: { user } }) => {
    const team = await db.team.create({
      data: {
        name,
        memberships: {
          create: {
            userId: user!.id,
            role: TeamMemberRoleSchema.Values.OWNER,
            isCreator: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        memberships: {
          select: {
            id: true,
            role: true,
            isCreator: true,
          },
        },
      },
    });

    return team;
  });
