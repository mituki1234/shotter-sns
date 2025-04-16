import { Post } from "@/types/post";
import PostItem from "./PostItem";

interface PostListProps {
  posts: Post[];
  handleLike: (docId: string) => void;
}

export default function PostList({ posts, handleLike }: PostListProps) {
  return (
    <>
      {posts.map((post, index) => (
        <PostItem key={post.docId || index} post={post} handleLike={handleLike} />
      ))}
    </>
  );
}