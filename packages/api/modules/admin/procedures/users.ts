import { TeamMembershipSchema, TeamSchema, UserSchema, db } from "database";
import { z } from "zod";
import { adminProcedure } from "../../../trpc/base";

export const users = adminProcedure
  .input(
    z.object({
      limit: z.number().optional().default(25),
      offset: z.number().optional().default(0),
      searchTerm: z.string().optional(),
    }),
  )
  .output(
    z.object({
      users: z.array(
        UserSchema.pick({
          id: true,
          email: true,
          emailVerified: true,
          role: true,
          avatarUrl: true,
          name: true,
        }).extend({
          memberships: z
            .array(
              TeamMembershipSchema.extend({
                team: TeamSchema,
              }),
            )
            .nullable(),
        }),
      ),
      total: z.number(),
    }),
  )
  .query(async ({ input: { limit, offset, searchTerm } }) => {
    const sanitizedSearchTerm = (searchTerm ?? "").trim().toLowerCase();

    const where = sanitizedSearchTerm
      ? {
          OR: [
            {
              name: {
                contains: sanitizedSearchTerm,
              },
            },
            {
              email: {
                contains: sanitizedSearchTerm,
              },
            },
          ],
        }
      : {};

    const users = await db.user.findMany({
      where,
      select: {
        avatarUrl: true,
        email: true,
        emailVerified: true,
        role: true,
        id: true,
        name: true,
        memberships: {
          include: {
            team: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });

    const total = await db.user.count({
      where,
    });

    return {
      users,
      total,
    };
  });
