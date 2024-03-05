import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { lucia } from "auth";
import { db } from "database";
import { cookies } from "next/headers";
import { getSignedUrl } from "storage";
import { defineAbilitiesFor } from "../modules/auth/abilities";

export async function createContext(
  params?: FetchCreateContextFnOptions | { isAdmin?: boolean },
) {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  const { user, session } = sessionId
    ? await lucia.validateSession(sessionId)
    : { user: null, session: null };

  const teamMemberships = user
    ? await Promise.all(
        (
          await db.teamMembership.findMany({
            where: {
              userId: user.id,
            },
            include: {
              team: true,
            },
          })
        ).map(async (membership) => ({
          ...membership,
          team: {
            ...membership.team,
            avatarUrl: membership.team.avatarUrl
              ? await getSignedUrl(membership.team.avatarUrl, {
                  bucket: "avatars",
                  expiresIn: 360,
                })
              : null,
          },
        })),
      )
    : null;

  const abilities = defineAbilitiesFor({
    user,
    teamMemberships,
  });

  return {
    user,
    teamMemberships,
    abilities,
    session,
    responseHeaders:
      params && "resHeaders" in params ? params.resHeaders : undefined,
    isAdmin: params && "isAdmin" in params ? params.isAdmin : false,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
