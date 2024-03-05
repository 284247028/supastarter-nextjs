import { TRPCError } from "@trpc/server";
import { db } from "database";
import { sendEmail } from "mail";
import { getBaseUrl } from "utils";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const inviteMember = protectedProcedure
  .input(
    z.object({
      teamId: z.string(),
      email: z.string(),
      role: z.enum(["MEMBER", "OWNER"]),
    }),
  )
  .mutation(async ({ input: { teamId, email, role }, ctx: { abilities } }) => {
    if (!abilities.isTeamOwner(teamId)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No permission to add a member to this team.",
      });
    }

    try {
      const invitation = await db.teamInvitation.create({
        data: {
          teamId,
          email,
          role,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        },
        include: {
          team: {
            select: {
              name: true,
            },
          },
        },
      });

      // get user

      await sendEmail({
        templateId: "teamInvitation",
        to: email,
        context: {
          url: `${getBaseUrl()}/team/invitation?code=${invitation.id}`,
          teamName: invitation.team.name,
        },
      });
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not invite member.",
      });
    }
  });
