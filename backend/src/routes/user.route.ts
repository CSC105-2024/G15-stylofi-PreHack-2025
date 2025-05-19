import { Hono } from "hono";
import * as userController from "../controllers/user.controller.ts";

const userRouter = new Hono();

userRouter.post("/signup", userController.createUser);
userRouter.post("/login", userController.loginUser);

export { userRouter };
