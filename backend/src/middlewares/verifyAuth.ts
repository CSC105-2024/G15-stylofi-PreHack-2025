import { type Context, type Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import jwt from "jsonwebtoken";

export const verifyAuth = async (c: Context, next: Next) => {
  try {
    const cookie = await getSignedCookie(
      c,
      process.env.SECRET_COOKIE!,
      "token"
    );
    console.log(cookie);

    if (typeof cookie !== "string") throw new Error("Invalid or missing token");

    const { userId, userEmail } = jwt.verify(
      cookie,
      process.env.JWT_SECRET_KEY!
    ) as {
      userId: string;
      userEmail: string;
    };

    c.set("userId", userId);
    c.set("userEmail", userEmail);
    await next();
  } catch (e) {
    return c.json(
      {
        success: false,
        data: null,
        msg: `${e}`,
      },
      401
    );
  }
};
