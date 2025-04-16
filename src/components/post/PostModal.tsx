'use client';
import { useState } from 'react';
import '@/styles/top.css';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: string;
  setUser: (user: string) => void;
  content: string;
  setContent: (content: string) => void;
  onSubmit: () => void;
  isPosting: boolean;
}

export default function PostModal({
  isOpen,
  onClose,
  user,
  setUser,
  content,
  setContent,
  onSubmit,
  isPosting
}: PostModalProps) {
  const [showPreview, setShowPreview] = useState(false);
  
  if (!isOpen) return null;
  
  const maxLength = 3000;
  const remaining = maxLength - content.length;
  const isNearLimit = remaining < 100;
  const isAtLimit = remaining <= 0;
  
  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>ノートを作成</h3>
          <button className="close-button" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <div className="user-input-container">
            <label className="user-input-label" htmlFor="username">ユーザー名</label>
            <input
              id="username"
              type="text"
              placeholder="匿名でもOK"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="user-input"
            />
          </div>
          
          <div className="formatting-toolbar">
            <button className="formatting-button" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={showPreview ? "#86b300" : "#848596"}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#848596">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              )}
            </button>
          </div>
          
          {!showPreview ? (
            <>
              <textarea
                placeholder="今何してる？"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={maxLength}
              />
              <div className={`character-count ${isNearLimit ? 'limit-near' : ''} ${isAtLimit ? 'limit-reached' : ''}`}>
                {remaining} / {maxLength}
              </div>
            </>
          ) : (
            <div className="preview-area">
              <div className="preview-header">プレビュー</div>
              <div className="preview-content">{content}</div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="emoji-button"></button>
          <button
            className="post-button"
            onClick={onSubmit}
            disabled={isPosting || content.trim() === '' || isAtLimit}
          >
            {isPosting ? "投稿中..." : "投稿する"}
          </button>
        </div>
      </div>
    </div>
  );
}