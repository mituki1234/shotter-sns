import Link from "next/link";
import '@/styles/components/sidebar.css';
interface SidebarProps {
  onNewPost: () => void;
}

export default function Sidebar({ onNewPost }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="logo">
        <Link href="/">
          <h2>shotter</h2>
        </Link>
      </div>
      <div className="menu">
        <p>プロフィール</p>
        <p>ホーム</p>
        <p>設定</p>
        <p className="tweet-button" onClick={onNewPost}>
          新規投稿
        </p>
      </div>
    </div>
  );
}