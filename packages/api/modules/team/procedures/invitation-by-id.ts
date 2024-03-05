import { TeamInvitationSchema, db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const invitationById = publicProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(
    TeamInvitationSchema.extend({
      team: z
        .object({
          name: z.string(),
        })
        .nullish(),
    }).nullable(),
  )
  .mutation(async ({ input: { id } }) => {
    const invitation = await db.teamInvitation.findFirst({
      where: {
        id,
      },
      include: {
        team: {
          select: {
            name: true,
          },
        },
      },
    });

    return invitation;
  });
