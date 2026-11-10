import { useState } from 'react'
import { Heart, MessageCircle, MoreHorizontal, Pencil, Trash2, CornerDownRight } from 'lucide-react'
import CommentComposer from './CommentComposer'

function timeAgo(timestamp) {
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function CommentItem({ comment, depth = 0, onReply, onLike, onDelete, onEdit }) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)

  const submitReply = (text) => {
    onReply(comment.id, text)
    setReplyOpen(false)
  }

  const submitEdit = (text) => {
    onEdit(comment.id, text)
    setEditing(false)
  }

  return (
    <article className="min-w-0">
      <div className="flex gap-3">
        <img src={comment.avatar} alt={`${comment.author}'s avatar`} className="h-10 w-10 shrink-0 rounded-full bg-slate-100 object-cover ring-2 ring-white" />
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl rounded-tl-md bg-[#f5f6fa] px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-ink">{comment.author}</p>
                <p className="truncate text-[11px] text-slate-400">{comment.handle} <span className="px-1">·</span>{timeAgo(comment.createdAt)}</p>
              </div>
              <div className="relative shrink-0">
                <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Comment options" className="rounded-full p-1 text-slate-400 hover:bg-white hover:text-slate-700"><MoreHorizontal size={17} /></button>
                {menuOpen && <div className="absolute right-0 top-7 z-20 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                  <button onClick={() => { setEditing(true); setMenuOpen(false) }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium hover:bg-slate-50"><Pencil size={13} /> Edit comment</button>
                  <button onClick={() => { onDelete(comment.id); setMenuOpen(false) }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50"><Trash2 size={13} /> Delete thread</button>
                </div>}
              </div>
            </div>
            {editing ? (
              <div className="mt-3"><CommentComposer compact initialValue={comment.text} buttonLabel="Save edit" onSubmit={submitEdit} onCancel={() => setEditing(false)} /></div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap break-words text-[13px] leading-[1.7] text-slate-700">{comment.text}</p>
            )}
          </div>

          <div className="ml-2 mt-1.5 flex flex-wrap items-center gap-4">
            <button onClick={() => onLike(comment.id)} className={`inline-flex items-center gap-1.5 text-[11px] font-semibold transition ${comment.liked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'}`}><Heart size={14} fill={comment.liked ? 'currentColor' : 'none'} />{comment.likes > 0 ? comment.likes : 'Like'}</button>
            <button onClick={() => setReplyOpen(!replyOpen)} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 transition hover:text-brand"><MessageCircle size={14} />Reply</button>
            {comment.replies?.length > 0 && <span className="text-[11px] text-slate-400">{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>}
          </div>

          {replyOpen && <div className="mt-3"><CommentComposer compact placeholder={`Reply to ${comment.author}...`} buttonLabel="Reply" onSubmit={submitReply} onCancel={() => setReplyOpen(false)} /></div>}

          {comment.replies?.length > 0 && (
            <div className="thread-line ml-1 mt-4 space-y-4 pl-3 sm:ml-2 sm:pl-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  onReply={onReply}
                  onLike={onLike}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}