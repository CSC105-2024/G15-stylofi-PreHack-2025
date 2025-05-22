import { Hono } from "hono";
import * as userController from "../controllers/user.controller.ts";
import { authCheck } from "../utils/authCheck.ts";

const userRouter = new Hono();

userRouter.get("/check", authCheck);
userRouter.post("/signup", userController.createUser);
userRouter.post("/signin", userController.signInUser);
userRouter.post("/refresh", userController.refreshToken);
userRouter.post("/signout", userController.signOutUser);

export { userRouter };
