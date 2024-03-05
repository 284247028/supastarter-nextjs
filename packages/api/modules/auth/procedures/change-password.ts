import { hashPassword } from "auth/lib/password";
import { db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const changePassword = protectedProcedure
  .input(
    z.object({
      password: z.string().min(8).max(255),
    }),
  )
  .mutation(async ({ ctx: { user }, input: { password } }) => {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword: await hashPassword(password),
      },
    });
  });
