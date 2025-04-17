'use client';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';

interface Reply {
  id: string;
  username: string;
  content: string;
  timestamp: string;
}

interface PostProps {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  onLike: (id: string) => void;
  replies?: Reply[];
  isDetailView?: boolean;
}

export default function Post({
  id,
  username,
  content,
  timestamp,
  likes,
  onLike,
  replies = [],
  isDetailView = false
}: PostProps) {
  const [replyCount, setReplyCount] = useState(replies.length);
  const [timeAgo, setTimeAgo] = useState('');
  const [userInitial, setUserInitial] = useState('');
  
  // 投稿時間を「〜前」形式に変換
  useEffect(() => {
    try {
      const date = new Date(timestamp);
      const formattedDate = formatDistanceToNow(date, { addSuffix: true, locale: ja });
      setTimeAgo(formattedDate);
    } catch (error) {
      setTimeAgo('不明な日時');
    }
    
    // ユーザー名の頭文字を取得
    if (username) {
      setUserInitial(username.charAt(0).toUpperCase());
    } else {
      setUserInitial('?');
    }
  }, [timestamp, username]);
  
  // リプライ数を更新
  useEffect(() => {
    setReplyCount(replies.length);
  }, [replies]);

  return (
    <div className="misskey-note">
      <div className="note-header">
        <div className="user-avatar">
          {userInitial}
        </div>
        <div className="user-info">
          <div className="username">{username || '匿名ユーザー'}</div>
          <div className="timestamp">{timeAgo}</div>
        </div>
      </div>
      
      <div className="note-content">
        <p>{content}</p>
      </div>
      
      {/* note-actionsではなくpost-actionsを使用 */}
      <div className="post-actions">
        <button
          onClick={() => onLike(id)}
          aria-label="いいね"
        >
          <span className="reaction-icon"></span>
          <span className="reaction-count">{likes}</span>
        </button>
        
        <Link href={`/post/${id}`}>
          <button
            aria-label="返信"
          >
            <span className="comment-icon"></span>
            <span className="reaction-count">{replyCount}</span>
          </button>
        </Link>
      </div>
    </div>
  );
}