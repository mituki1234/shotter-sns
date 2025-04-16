// リプライ用の特殊なPostItemコンポーネント
export default function ReplyItem({ post, handleReplyLike }: { post: any, handleReplyLike: (docId: string) => void }) {
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