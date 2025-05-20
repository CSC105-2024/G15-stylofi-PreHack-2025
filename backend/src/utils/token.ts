import jwt, { type JwtPayload } from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY!;
const cookieSecret = process.env.SECRET_COOKIE!;

const generateAccessToken = (payload: Record<string, any>) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: "15m",
  });

  return token;
};

const generateRefreshToken = (payload: Record<string, any>) => {
  const token = jwt.sign(payload, cookieSecret, {
    expiresIn: "7d",
  });

  return token;
};

const verifyAccessToken = (token: string): JwtPayload | null => {
  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    const { iat, exp, ...cleanPayload } = payload;
    return cleanPayload;
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token: string): JwtPayload | null => {
  if (!cookieSecret) {
    throw new Error("SECRET_COOKIE is not defined in environment variables");
  }

  try {
    const payload = jwt.verify(token, cookieSecret) as JwtPayload;
    const { iat, exp, ...cleanPayload } = payload;
    return cleanPayload;
  } catch (error) {
    return null;
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
