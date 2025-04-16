'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { usePost } from '@/hooks/usePosts';
// 正しいパスからPostItemをインポート
import PostItem from '@/components/post/PostItem';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { Sidebar } from '@/components/layout';
import '@/styles/components/sendReply.css'
import '@/styles/components/post.css';

export default function PostDetail() {
    const params = useParams();
    const id = params.id as string;
    const { post, loading, handleLike } = usePost(id);
    const [reply, setReply] = useState<any>([]);
    const [replyLoading, setReplyLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [username, setUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // リプライ専用のいいね機能を追加
    async function handleReplyLike(replyId: string) {
        try {
            const replyRef = doc(db, "posts", id, "reply", replyId);
            await updateDoc(replyRef, {
                likes: increment(1)
            });
            
            // 状態を更新するために再取得せずに、現在の状態を更新
            setReply((currentReplies: any) => 
                currentReplies.map((r: any) => 
                    r.docId === replyId ? {...r, likes: (r.likes || 0) + 1} : r
                )
            );
        } catch (error) {
            console.error("Error liking reply:", error);
        }
    }

    async function fetchReplies() {
        try {
            setReplyLoading(true);
            setReply([]); // 重複を避けるため、取得前に配列をクリア
            const replyCollection = collection(db, "posts", id, "reply");
            const querySnapshot = await getDocs(replyCollection);

            const repliesData: any[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                repliesData.push({
                    content: data.content,
                    likes: data.likes || 0,
                    user: data.user || "匿名ユーザー",
                    docId: doc.id,
                    createdAt: data.createdAt || null,
                    date: data.date || Date.now(),
                    ...data
                });
            });
            
            // 日付順にソート（新しい順 - 降順）
            repliesData.sort((a, b) => b.date - a.date);
            setReply(repliesData);
        } catch (error) {
            console.error("Error fetching replies:", error);
        } finally {
            setReplyLoading(false);
        }
    }
    
    async function handleSubmitReply() {
        if (!replyContent.trim()) return;
        
        try {
            setIsSubmitting(true);
            const replyCollection = collection(db, "posts", id, "reply");
            
            await addDoc(replyCollection, {
                content: replyContent,
                likes: 0,
                user: username || "匿名ユーザー",
                createdAt: serverTimestamp(),
                date: Date.now()
            });
            
            // 投稿後、リプライを再取得
            await fetchReplies();
            
            // フォームをリセット
            setReplyContent('');
            setUsername('');
        } catch (error) {
            console.error("Error submitting reply:", error);
            alert("リプライの投稿に失敗しました");
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        fetchReplies();
    }, [id]);

    // リプライ用の特殊なPostItemコンポーネント
    function ReplyItem({ post, handleReplyLike }: { post: any, handleReplyLike: (docId: string) => void }) {
        return (
            <div className="misskey-note reply-item">
                <div className="note-header">
                    <div className="user-avatar">{post.user?.charAt(0) || "匿"}</div>
                    <div className="user-info">
                        <span className="username">{post.user || "匿名ユーザー"}</span>
                        <span className="timestamp">{post.date ? new Date(post.date).toLocaleString() : "日時不明"}</span>
                    </div>
                </div>
                <div className="note-content">
                    <p>{post.content}</p>
                </div>
                <div className="note-actions">
                    <button 
                        onClick={() => handleReplyLike(post.docId)}
                        className="reaction-button"
                    >
                        <span className="reaction-icon"></span>
                        <span className="reaction-count">{post.likes || 0}</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='container'>
            <Sidebar onNewPost={() => {}} />
            <div className='content'>
                {loading ? (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        <p>読み込み中...</p>
                    </div>
                ) : post ? (
                    <div className="post-detail-container">
                        <div className="misskey-note main-post">
                            <PostItem post={post} handleLike={handleLike} />
                        </div>
                        
                        <div className="reply-form misskey-form">
                            <h3>リプライを投稿</h3>
                            <input 
                                type="text" 
                                placeholder='ユーザー名' 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="username-input"
                            />
                            <textarea 
                                placeholder='リプライ内容を入力' 
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="reply-textarea"
                            />
                            <button 
                                onClick={handleSubmitReply} 
                                disabled={isSubmitting || !replyContent.trim()}
                                className="reply-button"
                            >
                                {isSubmitting ? "送信中..." : "リプライを送信"}
                            </button>
                        </div>
                        
                        <div className="replies-section">
                            <h3>リプライ</h3>
                            {replyLoading ? (
                                <div className="loading">
                                    <div className="loading-spinner"></div>
                                    <p>リプライを読み込み中...</p>
                                </div>
                            ) : reply.length > 0 ? (
                                <div className="reply-list">
                                    {reply.map((replyItem: any, index: number) => (
                                        <ReplyItem 
                                            key={`${replyItem.docId}-${index}`} 
                                            post={replyItem} 
                                            handleReplyLike={handleReplyLike}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="no-replies">まだリプライはありません</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="not-found">投稿が見つかりませんでした</div>
                )}
            </div>
            
            <style jsx>{`
                .post-detail-container {
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .main-post {
                    margin-bottom: 20px;
                }
                
                .loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 0;
                }
                
                .loading-spinner {
                    width: 30px;
                    height: 30px;
                    border: 3px solid #86b300;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: spin 1s linear infinite;
                    margin-bottom: 10px;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .not-found, .no-replies {
                    background: #1a1c2d;
                    color: #bec8e0;
                    padding: 16px;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px solid #282e3f;
                }
                
                .replies-section h3 {
                    font-size: 18px;
                    margin: 20px 0 12px;
                    color: #d2d9ee;
                }
                
                .reply-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
            `}</style>
        </div>
    );
}