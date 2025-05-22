import { getSignedCookie, setSignedCookie } from "hono/cookie";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./token.ts";
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

  return { accessToken, refreshToken };
};

const getAuthState = async (c: Context) => {
  const secret = process.env.JWT_SECRET_KEY!;
  const cookieSecret = process.env.SECRET_COOKIE!;

  try {
    const accessToken = await getSignedCookie(c, secret, "token");
    const refreshToken = await getSignedCookie(
      c,
      cookieSecret,
      "refresh_token",
    );

    if (typeof refreshToken !== "string") return { isValid: false };

    const refreshPayload = verifyRefreshToken(refreshToken);
    if (!refreshPayload?.id || !refreshPayload?.email)
      return { isValid: false };

    let needsNewAccessToken = true;
    if (typeof accessToken === "string") {
      const accessPayload = verifyAccessToken(accessToken);
      needsNewAccessToken = !accessPayload;
    }

    return {
      isValid: true,
      userId: refreshPayload.id,
      userEmail: refreshPayload.email,
      needsNewTokens: needsNewAccessToken,
    };
  } catch {
    return { isValid: false };
  }
};

export { issueTokens, getAuthState };
