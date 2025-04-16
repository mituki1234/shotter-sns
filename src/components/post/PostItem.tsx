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
        <div className="note-header">
          <div className="user-avatar">{post.user?.charAt(0) || "匿"}</div>
          <div className="user-info">
            <span className="username">{post.user || "匿名ユーザー"}</span>
            <span className="timestamp">{post.date ? new Date(post.date).toLocaleString() : "日時不明"}</span>
          </div>
        </div>
      </div>
      <div className="note-content">
        <p>{post.content}</p>
      </div>
      <div className="post-actions">
        <button onClick={() => handleLike(post.docId)} className="reaction-button">
          <span className="reaction-icon"></span>
          <span className="reaction-count">{post.likes || 0}</span>
        </button>
        <button className="comment-button">
          <span className="comment-icon"></span>
          <Link href={`/posts/${post.docId}`}>
            コメント
          </Link>
        </button>
      </div>
    </div>
  );
}