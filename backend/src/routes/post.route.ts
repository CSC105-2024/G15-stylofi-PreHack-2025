import { Hono } from "hono";
import * as postController from "../controllers/post.controller.ts";
import { verifyAuth } from "../middlewares/verifyAuth.ts";
import { validateImage } from "../middlewares/validateImage.ts";
import { checkValidation } from "../middlewares/checkValidation.ts";

const postRouter = new Hono();

postRouter.use(verifyAuth);

postRouter.get("/user", postController.getAllPostsByUser);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:id", postController.getPost);
postRouter.get("/:id/like-status", postController.checkLikeStatus);
postRouter.post(
  "/validate-image",
  validateImage,
  postController.returnValidated
);
postRouter.post("/create", checkValidation, postController.createPost);
postRouter.put("/:id", postController.updatePost);
postRouter.put("/:id/like", postController.likePost);
postRouter.put("/:id/unlike", postController.unlikePost);
postRouter.delete("/:id", postController.deletePost);

export { postRouter };
