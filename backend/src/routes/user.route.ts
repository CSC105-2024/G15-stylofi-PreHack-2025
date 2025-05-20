import { Hono } from "hono";
import * as userController from "../controllers/user.controller.ts";

const userRouter = new Hono();

userRouter.post("/signup", userController.createUser);
userRouter.post("/signin", userController.loginUser);
userRouter.post("/refresh", userController.refreshToken);
userRouter.post("/signout", userController.logoutUser);

export { userRouter };
