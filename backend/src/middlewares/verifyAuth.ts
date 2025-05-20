import { type Context, type Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import { verifyAccessToken } from "../utils/token.ts";

export const verifyAuth = async (c: Context, next: Next) => {
  const secret = process.env.JWT_SECRET_KEY!;

  try {
    const cookie = await getSignedCookie(c, secret, "token");

    if (typeof cookie !== "string") {
      throw new Error("Invalid or missing token");
    }

    const payload = verifyAccessToken(cookie);

    if (
      !payload ||
      typeof payload !== "object" ||
      !payload.id ||
      !payload.email
    ) {
      throw new Error("Token verification failed");
    }

    c.set("userId", payload.id);
    c.set("userEmail", payload.email);
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
