import type { Context } from "hono";
import * as PostModel from "../models/post.model.ts";
import { cloudinary } from "../utils/cloudinary.ts";

const getPost = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Invalid ID", success: false }, 400);
  const post = await PostModel.getPost(id);
  if (!post) return c.json({ error: "Post not found", success: false }, 404);
  return c.json(post);
};

const getAllPosts = async (c: Context) => {
  const posts = await PostModel.getAllPosts();
  return c.json(posts);
};

const getAllPostsByUser = async (c: Context) => {
  const userId = c.get("userId");
  if (!userId) return c.json({ error: "Invalid ID", success: false }, 400);
  const posts = await PostModel.getAllPostsByUser(userId);
  return c.json(posts);
};

const createPost = async (c: Context) => {
  const formData = await c.req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const link = formData.get("link") as string;
  const image = formData.get("image") as File;

  if (!(image instanceof File)) {
    return c.json({ error: "Image is not a valid file upload" }, 400);
  }

  if (!title || !description || !link) {
    return c.json({ success: false, msg: "Missing required fields" }, 400);
  }

  try {
    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${image.type};base64,${base64Image}`;

    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: "stylofi",
      // categorization: "google_tagging",
      // auto_tagging: 0.7,
    });

    const authorId = c.get("userId");
    if (!authorId) return c.json({ error: "Unauthorized" }, 401);

    const labels = c.get("imageLabels") as string[];
    if (!labels) return c.json({ error: "Image labels missing" }, 400);

    const imageUrl = uploaded.secure_url;
    const id = uploaded.public_id.replace("stylofi/", "");

    const tagIds = await PostModel.getOrCreateTagIds(labels);

    const post = await PostModel.createPost({
      id,
      title,
      description,
      link,
      imageUrl,
      tagIds,
      authorId,
    });

    return c.json(post, 201);
  } catch (err) {
    return c.json({ error: "Failed to create post" }, 500);
  }
};

const updatePost = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Invalid ID", success: false }, 400);

  const body = await c.req.json();
  const { title, description } = body;

  if (!title || !description) {
    return c.json(
      {
        error: "Title and description are required",
        success: false,
      },
      400,
    );
  }

  try {
    const post = await PostModel.updatePost(id, { title, description });

    return c.json(
      {
        success: true,
        data: post,
        msg: "Post updated successfully",
      },
      200,
    );
  } catch (err) {
    console.error(err);
    return c.json(
      {
        error: "Failed to update post",
        success: false,
        msg: "Failed to update post",
      },
      500,
    );
  }
};

const deletePost = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Invalid ID", success: false }, 400);
  const userId = c.get("userId");

  try {
    const deletedPost = await PostModel.deletePost(id, userId);

    return c.json(
      {
        success: true,
        data: deletedPost,
        msg: `successful`,
      },
      200,
    );
  } catch (e) {
    return c.json(
      {
        success: false,
        data: null,
        msg: `${(e as Error).message}`,
      },
      404,
    );
  }
};

const returnValidated = async (c: Context) => {
  return c.json({ success: true, msg: "Image is fasion-related" });
};

const likePost = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Invalid ID", success: false }, 400);

  const userId = c.get("userId");
  if (!userId) return c.json({ error: "Unauthorized", success: false }, 401);

  try {
    const post = await PostModel.likePost(id, userId);
    return c.json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to like post", success: false }, 500);
  }
};

const unlikePost = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Invalid ID", success: false }, 400);

  const userId = c.get("userId");
  if (!userId) return c.json({ error: "Unauthorized", success: false }, 401);

  try {
    const post = await PostModel.unlikePost(id, userId);
    return c.json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to unlike post", success: false }, 500);
  }
};

const checkLikeStatus = async (c: Context) => {
  const id = c.req.param("id");
  if (!id) return c.json({ error: "Invalid ID", success: false }, 400);

  const userId = c.get("userId");
  if (!userId) return c.json({ error: "Unauthorized", success: false }, 401);

  try {
    const isLiked = await PostModel.checkIfUserLikedPost(id, userId);
    return c.json({ success: true, isLiked });
  } catch (err) {
    console.error(err);
    return c.json(
      { error: "Failed to check like status", success: false },
      500,
    );
  }
};

export {
  getPost,
  getAllPosts,
  getAllPostsByUser,
  createPost,
  updatePost,
  deletePost,
  returnValidated,
  likePost,
  unlikePost,
  checkLikeStatus,
};
