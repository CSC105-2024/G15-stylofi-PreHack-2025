import { Hono } from "hono";
import * as userController from "../controllers/user.controller.ts";

const userRouter = new Hono();

userRouter.post("/signup", userController.createUser);
userRouter.post("/signin", userController.loginUser);

export { userRouter };
