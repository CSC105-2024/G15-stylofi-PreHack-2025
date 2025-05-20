import { type Context, type Next } from "hono";
import { getCookie } from "hono/cookie";
import jwt from "jsonwebtoken";

export const verifyAuth = async (c: Context, next: Next) => {
  try {
    const cookie = getCookie(c)["token"];
    if (!cookie) {
      throw new Error("No cookie found");
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET_KEY!) as {
      userId: string;
      userEmail: string;
    };

    c.set("userId", decoded.userId);
    c.set("userEmail", decoded.userEmail);
    await next();
  } catch (e) {
    return c.json(
      {
        success: false,
        data: null,
        msg: `${e}`,
      },
      401,
    );
  }
};
