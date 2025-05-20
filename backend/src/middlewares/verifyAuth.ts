import { type Context, type Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import { verifyToken } from "../utils/token.ts";

export const verifyAuth = async (c: Context, next: Next) => {
  try {
    const cookie = await getSignedCookie(
      c,
      process.env.SECRET_COOKIE!,
      "token",
    );

    if (typeof cookie !== "string") {
      throw new Error("Invalid or missing token");
    }

    const payload = verifyToken(cookie);

    if (!payload || typeof payload !== "object" || !payload.userId) {
      throw new Error("Token verification failed");
    }

    c.set("userId", payload.userId);
    c.set("userEmail", payload.userEmail);
    await next();
  } catch (e) {
    return c.json(
      {
        success: false,
        data: null,
        msg: `Unauthorized: ${e instanceof Error ? e.message : String(e)}`,
      },
      401,
    );
  }
};
