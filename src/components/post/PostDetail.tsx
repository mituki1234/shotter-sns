'use client';
import { useState, useEffect } from 'react';
import Post from './PostItem';
import SendReply from '../reply/replyItem';

interface Reply {
  id: string;
  username: string;
  content: string;
  timestamp: string;
}

interface PostDetailProps {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  onLike: (id: string) => void;
  replies: Reply[];
  addReply: (postId: string, username: string, content: string) => Promise<void>;
}

export default function PostDetail({
  id,
  username,
  content,
  timestamp,
  likes,
  onLike,
  replies,
  addReply
}: PostDetailProps) {
  const [replyCount, setReplyCount] = useState(replies.length);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    setReplyCount(replies.length);
  }, [replies]);
  
  const handleSubmitReply = async (username: string, content: string) => {
    try {
      setIsSubmitting(true);
      await addReply(id, username, content);
      setReplyCount(prev => prev + 1);
    } catch (error) {
      console.error('Reply submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <Post
        id={id}
        username={username}
        content={content}
        timestamp={timestamp}
        likes={likes}
        onLike={onLike}
        replies={replies}
        isDetailView={true}
      />
      
      <SendReply onSubmit={handleSubmitReply} isSubmitting={isSubmitting} />
      
      <div className="replies-section">
        <h3>返信 {replyCount > 0 ? `(${replyCount})` : ''}</h3>
        
        {replyCount > 0 ? (
          replies.map((reply) => (
            <div key={reply.id} className="reply-item misskey-note">
              <div className="note-header">
                <div className="user-avatar">
                  {reply.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="username">{reply.username || '匿名ユーザー'}</div>
                  <div className="timestamp">
                    {new Date(reply.timestamp).toLocaleString('ja-JP')}
                  </div>
                </div>
              </div>
              <div className="note-content">
                <p>{reply.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-replies">
            <p>まだ返信はありません。最初の返信をしてみませんか？</p>
          </div>
        )}
      </div>
    </div>
  );
}