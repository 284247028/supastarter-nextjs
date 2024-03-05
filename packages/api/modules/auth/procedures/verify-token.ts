import { TRPCError } from "@trpc/server";
import { lucia, validateVerificationToken } from "auth";
import { db } from "database";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const verifyToken = publicProcedure
  .input(
    z.object({
      token: z.string(),
    }),
  )
  .mutation(async ({ input: { token }, ctx: { responseHeaders } }) => {
    try {
      const userId = await validateVerificationToken({
        token,
      });

      const user = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      if (!user.emailVerified)
        await db.user.update({
          where: { id: user.id },
          data: {
            emailVerified: true,
          },
        });

      const session = await lucia.createSession(userId, {});

      const sessionCookie = lucia.createSessionCookie(session.id);
      responseHeaders?.append("Set-Cookie", sessionCookie.serialize());

      return session;
    } catch (e) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid token",
      });
    }
  });
