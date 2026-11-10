import { Send, X } from 'lucide-react'
import { useState } from 'react'

export default function CommentComposer({ onSubmit, placeholder = 'Share your thoughts...', buttonLabel = 'Post comment', onCancel, compact = false, initialValue = '' }) {
  const [text, setText] = useState(initialValue)

  const submit = (event) => {
    event.preventDefault()
    const clean = text.trim()
    if (!clean) return
    onSubmit(clean)
    setText('')
  }

  return (
    <form onSubmit={submit} className="w-full">
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={compact ? 2 : 3}
        maxLength={1200}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-violet-100"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400">{text.length}/1200</span>
        <div className="flex items-center gap-2">
          {onCancel && <button type="button" onClick={onCancel} className="rounded-full px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"><X size={14} className="mr-1 inline" />Cancel</button>}
          <button type="submit" disabled={!text.trim()} className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40"><Send size={13} className="mr-1.5 inline" />{buttonLabel}</button>
        </div>
      </div>
    </form>
  )
}