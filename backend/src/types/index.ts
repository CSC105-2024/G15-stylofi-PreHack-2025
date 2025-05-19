export interface CreatePostInput {
  title: string;
  description?: string;
  authorId: string;
  likes: number;
  link?: string;
  imageUrl: string;
  tagIds: number[];
}
export interface CreateUserBody  {
  email: string;
  password: string;
  name: string;
};