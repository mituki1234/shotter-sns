'use client'
import React, { useState } from "react";
import styles from "./page.module.css";
import "@/styles/top.css";
import { usePosts } from "@/hooks/usePosts";
import { Sidebar } from "@/components/layout";
import { PostList, PostModal } from "@/components/post";

export default function Home() {
  const { posts, loading, handleLike, addPost } = usePosts();
  const [user, setUser] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);

  async function handleSubmitPost() {
    if (!newPostContent.trim()) return;
    
    setPosting(true);
    try {
      await addPost(newPostContent, user);
      setNewPostContent("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setPosting(false);
    }
  }

  return (
    <>
      <div className="container">
        <Sidebar onNewPost={() => setIsModalOpen(true)} />
        <div className="content">
          {loading ? (
            <div className="loading">投稿を読み込み中...</div>
          ) : (
            <PostList posts={posts} handleLike={handleLike} />
          )}
        </div>
      </div>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        setUser={setUser}
        content={newPostContent}
        setContent={setNewPostContent}
        onSubmit={handleSubmitPost}
        isPosting={posting}
      />
    </>
  );
}