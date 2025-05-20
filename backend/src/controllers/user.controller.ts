import type { Context } from "hono";
import * as userModel from "../models/user.model.ts";
import type { CreateUserBody } from "../types/index.ts";
import { issueTokens } from "../utils/auth.ts";
import { deleteCookie, getSignedCookie } from "hono/cookie";
import { verifyRefreshToken } from "../utils/token.ts";

const createUser = async (c: Context) => {
  try {
    const { username, email, password } = await c.req.json<CreateUserBody>();

    if (!username || !email || !password) {
      return c.json(
        { success: false, data: null, msg: "Missing required fields" },
        400,
      );
    }

    const userByEmail = await userModel.findByEmail(email);
    if (userByEmail) {
      return c.json({
        success: false,
        data: null,
        msg: "Email already exists",
      });
    }

    const userByName = await userModel.findByUsername(username);
    if (userByName) {
      return c.json({
        success: false,
        data: null,
        msg: "Username already exists",
      });
    }

    const newUser = await userModel.createUser(username, email, password);
    const { password: _, ...safeUser } = newUser;

    await issueTokens(c, safeUser);

    return c.json({ success: true, msg: "Created new user!" }, 201);
  } catch (e) {
    return c.json({ success: false, data: null, msg: `${e}` }, 500);
  }
};

const loginUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const user = await userModel.findByEmail(email);

    if (!user) {
      return c.json(
        { success: false, data: null, msg: "Email doesn't exist" },
        401,
      );
    }

    const isValid = await userModel.validatePassword(password, user.password);
    if (!isValid) {
      return c.json(
        { success: false, data: null, msg: "Invalid credentials" },
        401,
      );
    }

    const { password: _, ...safeUser } = user;
    await issueTokens(c, safeUser);

    return c.json({ success: true, msg: "Login successful" });
  } catch (e) {
    return c.json({ success: false, data: null, msg: `${e}` }, 500);
  }
};

const logoutUser = async (c: Context) => {
  deleteCookie(c, "token");
  deleteCookie(c, "refresh_token");

  return c.json({ success: true, msg: "Logged out successfully" });
};

const refreshToken = async (c: Context) => {
  const cookieSecret = process.env.SECRET_COOKIE!;

  try {
    const token = await getSignedCookie(c, cookieSecret, "refresh_token");

    if (typeof token !== "string") {
      throw new Error("Invalid or missing token");
    }

    const payload = verifyRefreshToken(token);

    if (
      !payload ||
      typeof payload !== "object" ||
      !payload.username ||
      !payload.email
    ) {
      throw new Error("Token verification failed");
    }

    await issueTokens(c, payload);

    return c.json({ success: true, msg: "Token refreshed" });
  } catch (e) {
    return c.json({ success: false, msg: "Invalid refresh token" }, 401);
  }
};

export { createUser, loginUser, logoutUser, refreshToken };
