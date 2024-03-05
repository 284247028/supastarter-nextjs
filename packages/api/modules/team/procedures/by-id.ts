import { TRPCError } from "@trpc/server";
import { TeamSchema, db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const byId = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(TeamSchema)
  .query(async ({ input: { id }, ctx: { abilities } }) => {
    const team = await db.team.findFirst({
      where: {
        id,
      },
    });

    if (!team) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Team not found.",
      });
    }

    if (!abilities.isTeamMember(team.id)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No permission to read this team.",
      });
    }

    return team;
  });
