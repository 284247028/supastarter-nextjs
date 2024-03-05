import { GitHub, OAuth2RequestError, generateState } from "arctic";
import { db } from "database";
import { cookies } from "next/headers";
import { lucia } from "../lib/lucia";

export const githubAuth = new GitHub(
  process.env.GITHUB_CLIENT_ID as string,
  process.env.GITHUB_CLIENT_SECRET as string,
);

const GITHUB_PROIVDER_ID = "github";

interface GitHubUser {
  id: number;
  email: string;
  name: string;
  login: string;
  avatar_url: string;
}

export async function githubRouteHandler() {
  const state = generateState();

  const url = await githubAuth.createAuthorizationURL(state, {
    scopes: ["email"],
  });

  cookies().set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    maxAge: 60 * 60,
    sameSite: "lax",
  });

  return Response.redirect(url);
}

export async function githubCallbackRouteHandler(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState)
    return new Response(null, {
      status: 400,
    });

  try {
    const tokens = await githubAuth.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          {
            oauthAccounts: {
              some: {
                providerId: GITHUB_PROIVDER_ID,
                providerUserId: String(githubUser.id),
              },
            },
          },
          {
            email: githubUser.email,
          },
        ],
      },
      select: {
        id: true,
        oauthAccounts: {
          select: {
            providerId: true,
          },
        },
      },
    });

    if (existingUser) {
      if (
        !existingUser.oauthAccounts.some(
          (account) => account.providerId === GITHUB_PROIVDER_ID,
        )
      ) {
        await db.userOauthAccount.create({
          data: {
            providerId: GITHUB_PROIVDER_ID,
            providerUserId: String(githubUser.id),
            userId: existingUser.id,
          },
        });
      }

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/app",
        },
      });
    }

    const newUser = await db.user.create({
      data: {
        email: githubUser.email,
        name: githubUser.name ?? githubUser.login,
        avatarUrl: githubUser.avatar_url,
        emailVerified: true,
      },
    });

    await db.userOauthAccount.create({
      data: {
        providerId: "github",
        providerUserId: String(githubUser.id),
        userId: newUser.id,
      },
    });
    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/app",
      },
    });
  } catch (e) {
    console.error(e);
    if (e instanceof OAuth2RequestError)
      return new Response(null, {
        status: 400,
      });

    return new Response(null, {
      status: 500,
    });
  }
}
