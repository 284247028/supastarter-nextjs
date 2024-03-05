import { TeamMembershipSchema, TeamSchema, UserSchema, db } from "database";
import { getSignedUrl } from "storage";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const user = publicProcedure
  .input(z.void())
  .output(
    UserSchema.pick({
      id: true,
      email: true,
      role: true,
      avatarUrl: true,
      name: true,
    })
      .extend({
        teamMemberships: z
          .array(
            TeamMembershipSchema.extend({
              team: TeamSchema,
            }),
          )
          .nullable(),
        impersonatedBy: UserSchema.pick({
          id: true,
          name: true,
        }).nullish(),
      })
      .nullable(),
  )
  .query(async ({ ctx: { user, session, teamMemberships } }) => {
    if (!user) return null;

    // if avatar url is only the path (e.g. /avatars/1234.png)
    // we need to create a signed url for accessing the storage
    let avatarUrl = user.avatarUrl ?? null;
    if (avatarUrl && !avatarUrl.startsWith("http"))
      avatarUrl = await getSignedUrl(avatarUrl, {
        bucket: "avatars",
        expiresIn: 360,
      });

    const impersonatedBy = session?.impersonatorId
      ? await db.user.findUnique({
          where: {
            id: session.impersonatorId,
          },
          select: {
            id: true,
            name: true,
          },
        })
      : undefined;

    return {
      ...user,
      avatarUrl,
      teamMemberships,
      impersonatedBy,
    };
  });
