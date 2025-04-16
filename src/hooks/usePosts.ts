import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { increment } from "firebase/firestore";
import { Post } from "@/types/post";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const postsCollection = await getDocs(collection(db, 'posts'));
      const postsData = postsCollection.docs.map((doc) => {
        const data = doc.data();
        return {
          content: data.content,
          likes: data.likes || 0,
          user: data.user || "匿名ユーザー",
          docId: doc.id,
          createdAt: data.createdAt || null,
          date: data.date,
          reply: data.reply || [],
          ...data
        } as Post;
      });

      // 投稿を新しい順に並べ替える
      postsData.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      });

      setPosts(postsData);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error("Error fetching posts:", e);
    }
  }

  async function handleLike(docId: string) {
    try {
      const postRef = doc(db, 'posts', docId);
      await updateDoc(postRef, {
        likes: increment(1)
      });
      // Update local state to reflect the change
      setPosts(posts.map(post =>
        post.docId === docId ? { ...post, likes: post.likes + 1 } : post
      ));
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  }

  async function addPost(content: string, user: string) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        content,
        likes: 0,
        user: user || "匿名ユーザー",
        createdAt: serverTimestamp(),
        date: Date.now(),
      });
      
      // 投稿後に最新の投稿を取得
      fetchPosts();
      return docRef.id;
    } catch (error) {
      console.error("Error posting:", error);
      throw error;
    }
  }

  return { posts, loading, handleLike, fetchPosts, addPost };
}

export function usePost(id: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const postDoc = doc(db, 'posts', id);
        const postSnapshot = await getDoc(postDoc);
        if (postSnapshot.exists()) {
          const postData = postSnapshot.data() as Post;
          postData.docId = postSnapshot.id;
          setPost(postData);
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    }

    if (id) {
      fetchPost();
    }
  }, [id]);

  async function handleLike(docId: string) {
    try {
      const postRef = doc(db, 'posts', docId);
      await updateDoc(postRef, {
        likes: increment(1)
      });
      if (post) {
        setPost({
          ...post,
          likes: (post.likes || 0) + 1
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  }

  return { post, loading, handleLike };
}