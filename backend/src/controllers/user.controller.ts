import type { Context } from "hono";
import * as userModel from "../models/user.model.ts";
import type { CreateUserBody } from "../types/index.ts";
import { setSignedCookie } from "hono/cookie";
import { generateToken } from "../utils/token.ts";

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

    const token = generateToken(safeUser);

    await setSignedCookie(c, "token", token, process.env.SECRET_COOKIE!, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 15,
    });

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

    const token = generateToken(user);

    await setSignedCookie(c, "token", token, process.env.SECRET_COOKIE!, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 15,
    });

    return c.json({ success: true, msg: "Login successful" });
  } catch (e) {
    return c.json({ success: false, data: null, msg: `${e}` }, 500);
  }
};

export { createUser, loginUser };
