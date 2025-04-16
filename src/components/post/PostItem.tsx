import Link from "next/link";
import { Post } from "@/types/post";
import '@/styles/components/post.css';

interface PostItemProps {
  post: Post;
  handleLike: (docId: string) => void;
}

export default function PostItem({ post, handleLike }: PostItemProps) {
  return (
    <div className="post">
      <div className="post-header">
        <h3>{post.user || "匿名ユーザー"}</h3>
        <span>{post.date ? new Date(post.date).toLocaleString() : "取得できません"}</span>
      </div>
      <p>{post.content}</p>
      <div className="post-actions">
        <button onClick={() => handleLike(post.docId)}>
          いいね {post.likes || 0}
        </button>
        <button>
          <Link href={`/posts/${post.docId}`}>
            コメント
          </Link>
        </button>
      </div>
    </div>
  );
}