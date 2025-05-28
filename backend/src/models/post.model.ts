import db from "../lib/db.ts";
import type { CreatePostInput } from "../types/index.ts";
import { cloudinary } from "../utils/cloudinary.ts";

const getPost = async (id: string) => {
  const post = await db.post.findUnique({ where: { id } });
  return post;
};

const getAllPosts = async () => {
  const posts = await db.post.findMany({ include: { tags: true } });
  return posts;
};

const getAllPostsByUser = async (userId: string) => {
  const posts = await db.post.findMany({
    where: { authorId: userId },
    include: {
      tags: true,
      author: true,
    },
  });
  return posts;
};

const createPost = async (data: CreatePostInput) => {
  const post = await db.post.create({
    data: {
      id: data.id,
      title: data.title,
      description: data.description,
      authorId: data.authorId,
      link: data.link,
      imageUrl: data.imageUrl,
      tags: {
        connect: data.tagIds.map((id) => ({ id })),
      },
    },
    include: {
      tags: true,
    },
  });
  return post;
};

const getOrCreateTagIds = async (labels: string[]) => {
  const tagIds = await Promise.all(
    labels.map(async (label) => {
      const tag = await db.tag.upsert({
        where: { name: label },
        update: {},
        create: { name: label },
      });
      return tag.id;
    })
  );
  return tagIds;
};

const updatePost = async (
  id: string,
  data: { title?: string; description?: string }
) => {
  const post = await db.post.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
    },
    include: {
      tags: true,
      author: true,
    },
  });

  return post;
};

const deletePost = async (id: string, authorId: string) => {
  await cloudinary.uploader.destroy(id);
  const post = await db.post.delete({ where: { id, authorId: authorId } });

  return post;
};

const likePost = async (postId: string, userId: string) => {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: { likedBy: true },
  });

  const alreadyLiked = post?.likedBy.some((user) => user.id === userId);

  if (alreadyLiked) {
    return post;
  }

  const updatedPost = await db.post.update({
    where: { id: postId },
    data: {
      likes: { increment: 1 },
      likedBy: {
        connect: { id: userId },
      },
    },
    include: {
      tags: true,
      author: true,
      likedBy: true,
    },
  });

  return updatedPost;
};

const unlikePost = async (postId: string, userId: string) => {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: { likedBy: true },
  });

  const alreadyLiked = post?.likedBy.some((user) => user.id === userId);

  if (!alreadyLiked) {
    return post;
  }

  const updatedPost = await db.post.update({
    where: { id: postId },
    data: {
      likes: { decrement: 1 },
      likedBy: {
        disconnect: { id: userId },
      },
    },
    include: {
      tags: true,
      author: true,
      likedBy: true,
    },
  });

  return updatedPost;
};

const checkIfUserLikedPost = async (postId: string, userId: string) => {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: { likedBy: true },
  });

  return post?.likedBy.some((user) => user.id === userId) || false;
};

export {
  getPost,
  getAllPosts,
  getAllPostsByUser,
  createPost,
  updatePost,
  deletePost,
  getOrCreateTagIds,
  likePost,
  unlikePost,
  checkIfUserLikedPost,
};
