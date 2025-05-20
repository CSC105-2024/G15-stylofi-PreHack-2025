import { Hono } from "hono";
import {
  createPost,
  getAllPosts,
  getAllPostsByUser,
  getPost,
  updatePost,
} from "../controllers/post.controller.ts";
import { verifyAuth } from "../middlewares/verifyAuth.ts";

const postRouter = new Hono();

postRouter.use(verifyAuth);

postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPost);
postRouter.get("/user/:userId", getAllPostsByUser);
postRouter.post("/", createPost);
postRouter.put("/:id", updatePost);
export { postRouter };
