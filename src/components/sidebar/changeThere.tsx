'use client';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 初期化時にシステム設定または保存されたテーマを取得
  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window === 'undefined') return;
    
    // ローカルストレージから以前の設定を読み込む
    const savedTheme = localStorage.getItem('theme');
    
    // システムの設定（ダークモードかどうか）を確認
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 保存された設定があればそれを使用し、なければシステム設定に従う
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      setIsDarkMode(prefersDark);
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }, []);
  
  // テーマの切り替え
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    
    // 状態を更新
    setIsDarkMode(!isDarkMode);
    
    // HTML要素にdata-theme属性を設定することでCSSが適用される
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // 設定を保存
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
    >
      <div className={`theme-toggle-icon ${isDarkMode ? 'moon' : 'sun'}`}></div>
    </button>
  );
}