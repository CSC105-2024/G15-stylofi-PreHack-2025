import type { Context } from "hono";
import * as userModel from "../models/user.model.ts";
import type { CreateUserBody } from "../types/index.ts";
import { issueTokens } from "../utils/auth.ts";
import { deleteCookie, getSignedCookie } from "hono/cookie";
import { verifyRefreshToken } from "../utils/token.ts";
import { sendOtp } from "../utils/otp.ts";

const createUser = async (c: Context) => {
  try {
    const { username, email, password } = await c.req.json<CreateUserBody>();

    if (!username || !email || !password) {
      return c.json(
        { success: false, data: null, msg: "Missing required fields" },
        400
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

    await userModel.createUser(username, email, password);

    const otp = await userModel.createOtp(email);
    await sendOtp(email, otp);

    return c.json({ success: true, msg: "OTP sent!" }, 201);
  } catch (e) {
    return c.json({ success: false, msg: `${e}` }, 500);
  }
};

const verifyOtp = async (c: Context) => {
  try {
    const { email, otp } = await c.req.json();
    if (!email || !otp) {
      return c.json({ success: false, msg: "Email and OTP are required" }, 400);
    }

    await userModel.verifyOtp(email, otp);
    return c.json({ success: true, msg: "OTP verified" });
  } catch (e) {
    return c.json({ success: false, msg: `${e}` }, 400);
  }
};

const resendOtp = async (c: Context) => {
  try {
    const { email } = await c.req.json();
    if (!email) {
      return c.json({ success: false, msg: "Email is required" }, 400);
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return c.json({ success: false, msg: "User not found" }, 404);
    }

    if (user.otpVerified) {
      return c.json({ success: false, msg: "User already verified" }, 400);
    }

    const otp = await userModel.resendOtp(email);
    await sendOtp(email, otp);

    return c.json({ success: true, msg: "OTP resent" });
  } catch (e) {
    return c.json({ success: false, msg: `${e}` }, 500);
  }
};

const signInUser = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const user = await userModel.findByEmail(email);

    if (!user) {
      return c.json(
        { success: false, data: null, msg: "Email doesn't exist" },
        401
      );
    }

    const isValid = await userModel.validatePassword(password, user.password);
    if (!isValid) {
      return c.json(
        { success: false, data: null, msg: "Invalid credentials" },
        401
      );
    }

    if (!user.otpVerified) {
      return c.json({ success: false, msg: "Please verify OTP first." }, 403);
    }

    const { password: _, ...safeUser } = user;
    const token = await issueTokens(c, safeUser);

    return c.json({
      success: true,
      msg: "Login successful",
      token: token.accessToken,
    });
  } catch (e) {
    return c.json({ success: false, data: null, msg: `${e}` }, 500);
  }
};

const signOutUser = async (c: Context) => {
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

const getUserById = async (c: Context) => {
  try {
    const userId = c.req.param("id");
    console.log("User ID param:", userId);
    if (!userId) {
      return c.json({ success: false, msg: "User ID is required" }, 400);
    }
    console.log("jas;kdjf;ladskjf;lk");

    const user = await userModel.findById(userId);
    if (!user) {
      return c.json({ success: false, msg: "User not found" }, 404);
    }
    return c.json({ success: true, data: user });
  } catch (e) {
    return c.json({ success: false, msg: `${e}` }, 500);
  }
};

const getLoggedInUser = async (c: Context) => {
  const userId = c.get("userId");
  console.log("userId", userId);

  if (!userId) {
    return c.json({ success: false, msg: "User ID is required" }, 400);
  }
  const user = await userModel.findById(userId);

  if (!user) {
    return c.json({ success: false, msg: "User is not found" }, 404);
  }
  return c.json({ success: true, data: user });
};

export {
  createUser,
  signInUser,
  signOutUser,
  refreshToken,
  verifyOtp,
  resendOtp,
  getUserById,
  getLoggedInUser,
};
