import { setSignedCookie } from "hono/cookie";
import { generateAccessToken, generateRefreshToken } from "./token.ts";
import type { Context } from "hono";

const issueTokens = async (c: Context, user: any) => {
  const secret = process.env.JWT_SECRET_KEY!;
  const cookieSecret = process.env.SECRET_COOKIE!;

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await setSignedCookie(c, "token", accessToken, secret, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 15,
  });

  await setSignedCookie(c, "refresh_token", refreshToken, cookieSecret, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
};

export { issueTokens };
