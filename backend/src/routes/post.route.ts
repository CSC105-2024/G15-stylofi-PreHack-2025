import { Hono } from "hono";
import {
  createPost,
  getAllPosts,
  getAllPostsByUser,
  getPost,
  updatePost,
} from "../controllers/post.controller.ts";

const postRouter = new Hono();
postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPost);
postRouter.get("/user/:userId", getAllPostsByUser);
postRouter.post("/", createPost);
postRouter.put("/:id", updatePost);
export { postRouter };
