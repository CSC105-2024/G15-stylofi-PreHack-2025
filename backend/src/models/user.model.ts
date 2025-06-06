import db from "../lib/db.js";
import { hash, compare } from "bcryptjs";

const findByEmail = async (email: string) => {
  const mail = await db.user.findUnique({
    where: { email },
  });
  return mail;
};

const findByUsername = async (username: string) => {
  const account = await db.user.findUnique({
    where: { username },
  });
  return account;
};

const findById = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
  });
  return user;
};

const getUserInfo = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      username: true,
      profilePic: true,
    },
  });
  return user;
};

const validatePassword = async (input: string, hash: string) => {
  return compare(input, hash);
};

const createOtp = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await db.user.update({
    where: { email },
    data: {
      otpCode: hashedOtp,
      otpExpiresAt: expiresAt,
      otpVerified: false,
    },
  });

  return otp;
};

const verifyOtp = async (email: string, otp: string) => {
  const user = await findByEmail(email);

  if (!user?.otpCode || !user.otpExpiresAt) throw new Error("OTP not set");

  const isExpired = user.otpExpiresAt < new Date();
  if (isExpired) throw new Error("OTP expired");

  const isMatch = await compare(otp, user.otpCode);
  if (!isMatch) throw new Error("Invalid OTP");

  await db.user.update({
    where: { email },
    data: {
      otpCode: null,
      otpExpiresAt: null,
      otpVerified: true,
    },
  });

  return true;
};

const resendOtp = async (email: string) => {
  return createOtp(email);
};

const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await hash(password, 10);
  const user = await db.user.create({
    data: {
      username: username,
      email: email,
      password: hashedPassword,
    },
  });
  return user;
};

const updateUser = async (
  userId: string,
  data: { username?: string; profilePic?: string; password?: string }
) => {
  const updateData: any = {};

  if (data.username) {
    updateData.username = data.username;
  }

  if (data.profilePic) {
    updateData.profilePic = data.profilePic;
  }

  if (data.password) {
    updateData.password = await hash(data.password, 10);
  }

  const user = await db.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      username: true,
      profilePic: true,
      password: true,
    },
  });

  return user;
};

export {
  findByEmail,
  validatePassword,
  createOtp,
  verifyOtp,
  resendOtp,
  createUser,
  updateUser,
  findByUsername,
  findById,
  getUserInfo,
};
