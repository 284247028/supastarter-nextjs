import { db, UserOneTimePasswordTypeType } from "database";
import { isWithinExpirationDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

export const generateVerificationToken = async ({
  userId,
  expireDuration = 1000 * 60 * 60 * 2,
}: {
  userId: string;
  expireDuration?: number;
}) => {
  const storedUserTokens = await db.userVerificationToken.findMany({
    where: {
      userId: userId,
    },
  });

  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      return isWithinExpirationDate(
        new Date(Number(token.expires) - expireDuration / 2),
      );
    });
    if (reusableStoredToken) return reusableStoredToken.token;
  }

  const token = generateRandomString(63, alphabet("0-9", "A-Z"));

  await db.userVerificationToken.create({
    data: {
      token,
      expires: new Date(new Date().getTime() + expireDuration),
      userId,
    },
  });

  return token;
};

export const validateVerificationToken = async ({
  token,
}: {
  token: string;
}) => {
  const storedToken = await db.userVerificationToken.findFirst({
    where: {
      token,
    },
  });

  if (!storedToken) throw new Error("Invalid token");

  await db.userVerificationToken.delete({
    where: {
      id: storedToken.id,
    },
  });

  if (!isWithinExpirationDate(storedToken.expires))
    throw new Error("Expired token");

  return storedToken.userId;
};

export const generateOneTimePassword = async ({
  userId,
  type,
  identifier,
  expireDuration = 1000 * 60 * 60 * 2,
}: {
  userId: string;
  type: UserOneTimePasswordTypeType;
  identifier: string;
  expireDuration?: number;
}) => {
  const storedUserTokens = await db.userOneTimePassword.findMany({
    where: {
      userId,
    },
  });

  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      return isWithinExpirationDate(
        new Date(Number(token.expires) - expireDuration / 2),
      );
    });
    if (reusableStoredToken) return reusableStoredToken.code;
  }

  const otp = generateRandomString(6, alphabet("0-9"));

  await db.userOneTimePassword.create({
    data: {
      code: otp,
      type,
      identifier,
      expires: new Date(new Date().getTime() + expireDuration),
      userId,
    },
  });

  return otp;
};

export const validateOneTimePassword = async ({
  code,
  type,
  identifier,
}: {
  code: string;
  type: UserOneTimePasswordTypeType;
  identifier?: string;
}) => {
  const storedOtp = await db.userOneTimePassword.findFirst({
    where: {
      code,
      type,
      identifier,
    },
  });

  if (!storedOtp) throw new Error("Invalid token");

  await db.userOneTimePassword.delete({
    where: {
      id: storedOtp.id,
    },
  });

  if (!isWithinExpirationDate(storedOtp.expires))
    throw new Error("Expired token");

  return storedOtp.userId;
};
