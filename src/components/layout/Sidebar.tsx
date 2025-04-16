'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/sidebar/changeThere';
import '@/styles/components/sidebar.css'; // CSSファイルをインポート

interface SidebarProps {
  onNewPost: () => void;
}

export default function Sidebar({ onNewPost }: SidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 画面サイズが変わったときにメニューを閉じる
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);
  
  // 画面外クリックでメニューを閉じる
  const handleOverlayClick = () => {
    setIsMenuOpen(false);
  };
  
  return (
    <>
      <div className={`sidebar ${isMenuOpen ? 'show' : ''}`}>
        <div className="logo">
          <h2>Shotter</h2>
        </div>
        <nav className="menu">
          <Link href="/" className="menu-item active">
            <div className="menu-icon home-icon"></div>
            ホーム
          </Link>
        </nav>
        <button onClick={onNewPost} className="new-post-button">
          <span className="new-post-icon"></span>
          ノートする
        </button>
      </div>
      
      {/* モバイルメニュートグルボタン */}
      <button 
        className="menu-toggle" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="メニューを開く"
      >
        <div className="menu-toggle-icon"></div>
      </button>
      
      {/* オーバーレイ（モバイルメニュー表示時） */}
      <div 
        className={`sidebar-overlay ${isMenuOpen ? 'show' : ''}`} 
        onClick={handleOverlayClick}
      ></div>
    </>
  );
}