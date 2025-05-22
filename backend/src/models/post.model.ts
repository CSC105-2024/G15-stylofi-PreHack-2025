import db from "../lib/db.ts";
import type { CreatePostInput } from "../types/index.ts";

const getPost = async (id: number) => {
  const post = await db.post.findUnique({ where: { id } });
  return post;
};

const getAllPosts = async () => {
  const posts = await db.post.findMany({});
  return posts;
};

const getAllPostsByUser = async (userId: string) => {
  const posts = await db.post.findMany({ where: { authorId: userId } });
  return posts;
};

const createPost = async (data: CreatePostInput) => {
  const post = await db.post.create({
    data: {
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
    }),
  );
  return tagIds;
};

const updatePost = async (
  id: number,
  data: { title?: string; description?: string },
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

const deletePost = async (id: number, authorId: string) => {
  const post = await db.post.delete({ where: { id, authorId: authorId } });

  return post;
};

export {
  getPost,
  getAllPosts,
  getAllPostsByUser,
  createPost,
  updatePost,
  deletePost,
  getOrCreateTagIds,
};
