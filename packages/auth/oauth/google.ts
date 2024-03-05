import {
  Google,
  OAuth2RequestError,
  generateCodeVerifier,
  generateState,
} from "arctic";
import { db } from "database";
import { cookies } from "next/headers";
import { getBaseUrl } from "utils";
import { lucia } from "../lib/lucia";

export const googleAuth = new Google(
  process.env.GOOGLE_CLIENT_ID as string,
  process.env.GOOGLE_CLIENT_SECRET as string,
  new URL("/api/oauth/google/callback", getBaseUrl()).toString(),
);

const GOOGLE_PROIVDER_ID = "google";

interface GoogleUser {
  sub: string;
  email: string;
  email_verified?: boolean;
  picture?: string;
  name: string;
}

export async function googleRouteHandler() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await googleAuth.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  cookies().set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    maxAge: 60 * 60,
    sameSite: "lax",
  });

  // store code verifier as cookie
  cookies().set("code_verifier", codeVerifier, {
    secure: true, // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  return Response.redirect(url);
}

export async function googleCallbackRouteHandler(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier = cookies().get("code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    !storedCodeVerifier ||
    state !== storedState
  )
    return new Response(null, {
      status: 400,
    });

  try {
    const tokens = await googleAuth.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );
    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const googleUser: GoogleUser = await googleUserResponse.json();

    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          {
            oauthAccounts: {
              some: {
                providerId: GOOGLE_PROIVDER_ID,
                providerUserId: googleUser.sub,
              },
            },
          },
          {
            email: googleUser.email,
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
          (account) => account.providerId === GOOGLE_PROIVDER_ID,
        )
      ) {
        await db.userOauthAccount.create({
          data: {
            providerId: GOOGLE_PROIVDER_ID,
            providerUserId: googleUser.sub,
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
        email: googleUser.email,
        emailVerified: true,
        name: googleUser.name,
        avatarUrl: googleUser.picture,
      },
    });

    await db.userOauthAccount.create({
      data: {
        providerId: GOOGLE_PROIVDER_ID,
        providerUserId: googleUser.sub,
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
