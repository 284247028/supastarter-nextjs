import { generateVerificationToken, lucia } from "auth";
import { db } from "database";
import { sendEmail } from "mail";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const changeEmail = protectedProcedure
  .input(
    z.object({
      email: z
        .string()
        .email()
        .min(1)
        .max(255)
        .transform((v) => v.toLowerCase()),
      callbackUrl: z.string(),
    }),
  )
  .mutation(
    async ({
      ctx: { user, responseHeaders },
      input: { email, callbackUrl },
    }) => {
      const updatedUser = await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          email,
          emailVerified: false,
        },
      });

      await lucia.invalidateUserSessions(user.id);
      const sessionCookie = lucia.createBlankSessionCookie();
      responseHeaders?.append("Set-Cookie", sessionCookie.serialize());

      const token = await generateVerificationToken({
        userId: user.id,
      });

      const url = new URL(callbackUrl);
      url.searchParams.set("token", token);

      sendEmail({
        to: email,
        templateId: "emailChange",
        context: {
          name: updatedUser.name ?? updatedUser.email,
          url: url.toString(),
        },
      });
    },
  );
