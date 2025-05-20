import { compare } from "bcrypt";
import db from "../lib/db.js";
import bcrypt from "bcryptjs";

const findByEmail = async (email: string) => {
  const mail = await db.user.findUnique({
    where: { email },
  });
  return mail;
};

const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
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
  userName: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      username: userName,
      password: hashedPassword,
    },
  });

  return updatedUser;
};

const findByUsername = async (username: string) => {
  const account = await db.user.findUnique({
    where: { username },
  });
  return account;
};

export { findByEmail, createUser, updateUser, findByUsername };
