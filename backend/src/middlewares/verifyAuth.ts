import { type Context, type Next } from "hono";
import { setSignedCookie } from "hono/cookie";
import { generateAccessToken, generateRefreshToken } from "../utils/token.ts";
import { getAuthState } from "../utils/auth.ts";

const verifyAuth = async (c: Context, next: Next) => {
  const secret = process.env.JWT_SECRET_KEY!;
  const cookieSecret = process.env.SECRET_COOKIE!;

  const authState = await getAuthState(c);

  if (!authState.isValid) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (authState.needsNewTokens) {
    const newAccessToken = generateAccessToken({
      id: authState.userId,
      email: authState.userEmail,
    });

    const newRefreshToken = generateRefreshToken({
      id: authState.userId,
      email: authState.userEmail,
    });

    await Promise.all([
      setSignedCookie(c, "token", newAccessToken, secret, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict" as const,
        path: "/",
        maxAge: 15 * 60,
      }),
      setSignedCookie(c, "refresh_token", newRefreshToken, cookieSecret, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      }),
    ]);
  }

  c.set("userId", authState.userId);
  c.set("userEmail", authState.userEmail);
  await next();
};

export { verifyAuth };
