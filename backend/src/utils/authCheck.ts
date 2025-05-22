import type { Context } from "hono";
import { getAuthState } from "./auth.ts";

const authCheck = async (c: Context) => {
  const authState = await getAuthState(c);
  return c.json({
    authenticated: authState.isValid,
    user: authState.isValid
      ? {
          id: authState.userId,
          email: authState.userEmail,
        }
      : null,
  });
};

export { authCheck };
