import db from "../lib/db.ts";
import type { CreatePostInput } from "../types/index.ts";

const getPost = async (id: number) => {
  const post = await db.post.findUnique({ where: { id } });
  return post;
};

const createPost = async (data: CreatePostInput) => {
  const post = await db.post.create({
    data: {
      title: data.title,
      description: data.description,
      authorId: data.authorId,
      likes: data.likes,
      link: data.link,
      imageUrl: data.imageUrl,
      tags: {
        connect: data.tagIds.map((id) => ({ id })),
      },
    },
    include: {
      tags: true,
      author: true,
    },
  });
  return post;
};

const updatePost = async (
  id: number,
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

export { getPost, createPost, updatePost };
