import type { Context, Next } from "hono";
import { validateImage } from "./validateImage.ts";

const checkValidation = async (c: Context, next: Next) => {
  const imageValidated = c.get("imageValidated");
  if (!imageValidated) {
    await validateImage(c, next);
  } else {
    await next();
  }
};

export { checkValidation };
