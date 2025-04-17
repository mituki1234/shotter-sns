'use client';
import { useState, useEffect } from 'react';
import Post from '@/components/post/PostItem';
import Sidebar from '@/components/layout/Sidebar';
import PostModal from '@/components/PostModal';
import ThemeToggle from '@/components/ThemeToggle';
import { fetchPosts, likePost, createPost } from '@/lib/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState('');
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  // 投稿データを取得する
  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts();
      // 各投稿にリプライ数のプロパティを追加
      const postsWithReplyCounts = data.map(post => ({
        ...post,
        replyCount: post.replies?.length || 0
      }));
      setPosts(postsWithReplyCounts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 初回レンダリング時にデータを取得
  useEffect(() => {
    loadPosts();
  }, []);
  
  // いいねボタンのハンドラ
  const handleLike = async (id) => {
    try {
      await likePost(id);
      setPosts(posts.map(post => 
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };
  
  // 投稿の送信
  const handleSubmitPost = async () => {
    if (!content.trim()) return;
    
    setIsPosting(true);
    try {
      await createPost(user || '匿名ユーザー', content);
      setContent('');
      setIsModalOpen(false);
      // 新しい投稿を含めて再取得
      loadPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsPosting(false);
    }
  };
  
  return (
    <div className="container">
      <Sidebar onNewPost={() => setIsModalOpen(true)} />
      
      <main className="content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>投稿を読み込んでいます...</p>
          </div>
        ) : (
          <>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  content={post.content}
                  timestamp={post.timestamp}
                  likes={post.likes}
                  onLike={handleLike}
                  replies={post.replies || []}
                />
              ))
            ) : (
              <div className="no-posts">
                <p>投稿がありません。最初の投稿をしてみましょう！</p>
              </div>
            )}
            
            <div className="refresh-info">
              最終更新: {new Date().toLocaleString('ja-JP')}
              <button 
                onClick={loadPosts} 
                className="refresh-button"
                aria-label="更新"
              >
                更新する
              </button>
            </div>
          </>
        )}
        
        <ThemeToggle />
      </main>
      
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        setUser={setUser}
        content={content}
        setContent={setContent}
        onSubmit={handleSubmitPost}
        isPosting={isPosting}
      />
    </div>
  );
}