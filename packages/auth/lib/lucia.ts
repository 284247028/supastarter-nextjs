import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "database";
import { Lucia, User } from "lucia";
import { DatabaseSessionAttributes, DatabaseUserAttributes } from "../types";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

const prismaClient = new PrismaClient();

const adapter = new PrismaAdapter(prismaClient.userSession, prismaClient.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(data) {
    return {
      id: data.id,
      email: data.email,
      emailVerified: data.emailVerified,
      name: data.name ?? data.email,
      role: data.role,
      avatarUrl: data.avatarUrl,
    };
  },
  getSessionAttributes: (databaseSession) => {
    return {
      impersonatorId: databaseSession.impersonatorId,
    };
  },
});

export type SessionUser = User;
export { Scrypt, type Session } from "lucia";
