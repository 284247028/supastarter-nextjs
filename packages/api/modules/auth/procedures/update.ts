import { db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const update = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).optional(),
      avatarUrl: z.string().min(1).optional(),
    }),
  )
  .mutation(async ({ ctx: { user }, input: { name, avatarUrl } }) => {
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        avatarUrl,
      },
    });
  });
