import OpenAI from "openai";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const generateProductNames = protectedProcedure
  .input(
    z.object({
      topic: z.string(),
    }),
  )
  .output(z.array(z.string()))
  .query(async ({ input: { topic } }) => {
    const openai = new OpenAI({
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      apiKey: process.env.OPENAI_API_KEY as string,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `List me five funny product names that could be used for ${topic}`,
        },
      ],
    });

    const ideas = (response.choices[0].message.content ?? "")
      .split("\n")
      .filter((name) => name.length > 0);

    return ideas;
  });
