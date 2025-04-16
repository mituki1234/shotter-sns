import Link from 'next/link';
import '@/styles/components/sidebar.css';

interface SidebarProps {
  onNewPost: () => void;
}

export default function Sidebar({ onNewPost }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Shotter</h2>
      </div>
      <nav className="menu">
        <Link href="/" className="menu-item active">
          <div className="menu-icon home-icon"></div>
          ホーム
        </Link>
        <Link href="/profile" className="menu-item">
          <div className="menu-icon profile-icon"></div>
          プロフィール
        </Link>
        <Link href="/notifications" className="menu-item">
          <div className="menu-icon notifications-icon"></div>
          通知
        </Link>
        <Link href="/search" className="menu-item">
          <div className="menu-icon search-icon"></div>
          検索
        </Link>
      </nav>
      <button onClick={onNewPost} className="new-post-button">
        <span className="new-post-icon"></span>
        新しい投稿
      </button>
    </div>
  );
}