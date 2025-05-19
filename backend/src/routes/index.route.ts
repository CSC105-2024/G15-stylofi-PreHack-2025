import { Hono } from "hono";
import { userRouter } from "./user.route.ts";
import { postRouter } from "./post.route.ts";

const mainRouter = new Hono();

mainRouter.route("/auth", userRouter);
mainRouter.route("/posts", postRouter);

export { mainRouter };
