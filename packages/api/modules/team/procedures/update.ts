import { TRPCError } from "@trpc/server";
import { TeamSchema, db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const update = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      avatarUrl: z.string().optional(),
    }),
  )
  .output(TeamSchema)
  .mutation(async ({ input: { id, name, avatarUrl }, ctx: { abilities } }) => {
    if (!abilities.isTeamOwner(id)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No permission to update this team.",
      });
    }

    const team = await db.team.update({
      where: {
        id,
      },
      data: {
        name,
        avatarUrl,
      },
    });

    return team;
  });
