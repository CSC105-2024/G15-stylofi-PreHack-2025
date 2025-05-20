import jwt, { type JwtPayload } from "jsonwebtoken";

const generateToken = (user: { id: string }) => {
  const secret = process.env.JWT_SECRET_KEY!;

  const token = jwt.sign(
    {
      userId: user.id,
    },
    secret,
    {
      expiresIn: "15m",
    },
  );

  return token;
};

const verifyToken = (token: string): JwtPayload | null => {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }

  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken };
