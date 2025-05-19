import { Hono } from "hono";
import { userRouter } from "./user.route.ts";

const mainRouter = new Hono();

mainRouter.route("/auth", userRouter);

export { mainRouter };
