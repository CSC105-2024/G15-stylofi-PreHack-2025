import { Hono } from "hono";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostsByUser,
  getPost,
  updatePost,
} from "../controllers/post.controller.ts";
import { verifyAuth } from "../middlewares/verifyAuth.ts";

const postRouter = new Hono();

postRouter.use(verifyAuth);

postRouter.get("/user", getAllPostsByUser);
postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPost);
postRouter.post("/create", createPost);
postRouter.put("/:id", updatePost);
postRouter.delete("/:id", deletePost);

export { postRouter };
