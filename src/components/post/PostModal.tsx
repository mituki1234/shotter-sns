interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: string;
  setUser: (user: string) => void;
  content: string;
  setContent: (content: string) => void;
  onSubmit: () => Promise<void>;
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
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>新規投稿</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="ユーザー名"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <textarea
            placeholder="投稿内容（五文字以内）"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            maxLength={5}
          />
          <div className="character-count">{content.length}/5</div>
        </div>
        <div className="modal-footer">
          <button
            className="post-button"
            onClick={onSubmit}
            disabled={isPosting || !content.trim()}
          >
            {isPosting ? '投稿中...' : '投稿する'}
          </button>
        </div>
      </div>
    </div>
  );
}