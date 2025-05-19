import type { Context } from "hono";
import * as PostModel from "../models/post.model.ts";

const getPost = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid ID", success: false }, 400);
  const post = await PostModel.getPost(id);
  if (!post) return c.json({ error: "Post not found", success: false }, 404);
  return c.json(post);
};

const getAllPosts = async (c: Context) => {
  const posts = await PostModel.getAllPosts();
  return c.json(posts);
};

const getAllPostsByUser = async (c: Context) => {
  const userId = c.req.param("userId");
  if (!userId) return c.json({ error: "Invalid ID", success: false }, 400);
  const posts = await PostModel.getAllPostsByUser(userId);
  return c.json(posts);
};

const createPost = async (c: Context) => {
  const body = await c.req.json();

  const authorId = "cmauumrf10000t0bueadq9wlu";

  if (
    !body.title ||
    !authorId ||
    !body.imageUrl ||
    !Array.isArray(body.tagIds)
  ) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  try {
    const post = await PostModel.createPost({ ...body, authorId });
    return c.json(post, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to create post" }, 500);
  }
};

const updatePost = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const body = await c.req.json();
  const { title, description } = body;

  try {
    const post = await PostModel.updatePost(id, { title, description });
    return c.json(post);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to update post" }, 500);
  }
};

export { getPost, getAllPosts, getAllPostsByUser, createPost, updatePost };
