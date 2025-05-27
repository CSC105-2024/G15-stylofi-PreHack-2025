import { Hono } from "hono";
import * as userController from "../controllers/user.controller.ts";
import { authCheck } from "../utils/authCheck.ts";
import { verifyAuth } from "../middlewares/verifyAuth.ts";

const userRouter = new Hono();

userRouter.get("/check", authCheck);
userRouter.post("/signup", userController.createUser);
userRouter.post("/verify-otp", userController.verifyOtp);
userRouter.post("/resend-otp", userController.resendOtp);
userRouter.post("/signin", userController.signInUser);
userRouter.post("/refresh", userController.refreshToken);
userRouter.post("/signout", userController.signOutUser);
userRouter.get("/me", verifyAuth, userController.getLoggedInUser);
userRouter.get("/username/:id", userController.getUserName);
userRouter.get("/:id", userController.getUserById);

export { userRouter };
