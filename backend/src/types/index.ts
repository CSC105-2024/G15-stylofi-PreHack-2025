export interface CreatePostInput {
  id: string;
  title: string;
  description?: string;
  authorId: string;
  likes?: number;
  link: string;
  imageUrl: string;
  tagIds: number[];
}
export interface CreateUserBody {
  username: string;
  email: string;
  password: string;
}
