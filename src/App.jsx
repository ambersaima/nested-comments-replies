import { useEffect, useMemo, useState } from 'react'
import { MessageCircle, Search, Sparkles, Users, ChevronDown, Hash, Heart, MessageSquareText, ArrowUpRight, SlidersHorizontal, Code2, Menu, X } from 'lucide-react'
import CommentComposer from './components/CommentComposer'
import CommentItem from './components/CommentItem'
import { seedComments, currentUser } from './data/seedComments'
import { countComments, updateCommentTree, removeCommentTree, findComment, flattenComments } from './utils/commentTree'

const STORAGE_KEY = 'threadly-comments-v1'

function loadComments() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : seedComments
  } catch {
    return seedComments
  }
}

function App() {
  const [comments, setComments] = useState(loadComments)
  const [sortBy, setSortBy] = useState('newest')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
  }, [comments])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const totalComments = countComments(comments)
  const allComments = useMemo(() => flattenComments(comments), [comments])
  const totalLikes = allComments.reduce((sum, item) => sum + item.likes, 0)

  const visibleComments = useMemo(() => {
    const query = search.trim().toLowerCase()
    let list = [...comments]
    if (sortBy === 'oldest') list.sort((a, b) => a.createdAt - b.createdAt)
    else if (sortBy === 'popular') list.sort((a, b) => b.likes - a.likes)
    else list.sort((a, b) => b.createdAt - a.createdAt)

    if (!query) return list
    // Keep a top-level thread if any comment or reply in that thread matches.
    const threadMatches = (node) => `${node.author} ${node.handle} ${node.text}`.toLowerCase().includes(query)
      || (node.replies || []).some(threadMatches)
    return list.filter(threadMatches)
  }, [comments, search, sortBy])

  const addTopLevel = (text) => {
    const newComment = {
      id: crypto.randomUUID ? crypto.randomUUID() : `comment-${Date.now()}`,
      author: currentUser.name,
      handle: currentUser.handle,
      avatar: currentUser.avatar,
      text,
      createdAt: Date.now(),
      likes: 0,
      liked: false,
      replies: [],
    }
    setComments((prev) => [newComment, ...prev])
    setToast('Your comment has been posted')
  }

  const addReply = (parentId, text) => {
    const reply = {
      id: crypto.randomUUID ? crypto.randomUUID() : `reply-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      author: currentUser.name,
      handle: currentUser.handle,
      avatar: currentUser.avatar,
      text,
      createdAt: Date.now(),
      likes: 0,
      liked: false,
      replies: [],
    }
    setComments((prev) => updateCommentTree(prev, parentId, (node) => ({ ...node, replies: [...(node.replies || []), reply] })))
    setToast('Your reply has been added')
  }

  const toggleLike = (id) => {
    setComments((prev) => updateCommentTree(prev, id, (node) => ({
      ...node,
      liked: !node.liked,
      likes: Math.max(0, node.likes + (node.liked ? -1 : 1)),
    })))
  }

  const deleteComment = (id) => {
    const target = findComment(comments, id)
    if (!target) return
    if (!window.confirm('Delete this comment and all replies inside its thread?')) return
    setComments((prev) => removeCommentTree(prev, id))
    setToast('Comment thread deleted')
  }

  const editComment = (id, text) => {
    setComments((prev) => updateCommentTree(prev, id, (node) => ({ ...node, text })))
    setToast('Comment updated')
  }

  return (
    <div className="min-h-screen bg-canvas pb-12">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1120px] items-center justify-between px-4">
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-violet-200"><MessageSquareText size={21} /></div>
            <div><span className="font-display text-[19px] font-extrabold tracking-tight text-ink">threadly<span className="text-brand">.</span></span><p className="-mt-1 text-[9px] font-bold uppercase tracking-[.2em] text-slate-400">Community space</p></div>
          </a>
          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-slate-500 sm:flex">
            <a href="#discussion" className="text-brand">Discussions</a>
            <a href="#guidelines" className="transition hover:text-ink">Guidelines</a>
            <a href="#about" className="transition hover:text-ink">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block"><span className="block text-xs font-bold text-ink">{currentUser.name}</span><span className="block text-[10px] text-slate-400">{currentUser.handle}</span></span>
            <img src={currentUser.avatar} alt="Your profile" className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-100" />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1120px] grid-cols-1 gap-6 px-4 pt-7 lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0">
          <section className="relative overflow-hidden rounded-3xl bg-[#242044] px-6 py-8 text-white shadow-card sm:px-9 sm:py-10">
            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[38px] border-white/5" />
            <div className="absolute -bottom-28 right-36 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative max-w-[560px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-violet-200"><Sparkles size={13} /> Ideas grow together</div>
              <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-[40px]">A place for good<br className="hidden sm:block" /> conversations.</h1>
              <p className="mt-3 max-w-[460px] text-[13px] leading-6 text-violet-100/75 sm:text-sm">Ask questions, share what you are learning, and keep the discussion going. Every reply has a place in the thread.</p>
              <a href="#discussion" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-[#29234f] transition hover:bg-violet-100">Join the conversation <ArrowUpRight size={15} /></a>
            </div>
            <div className="absolute bottom-7 right-8 hidden h-28 w-28 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 sm:flex"><MessageCircle size={49} strokeWidth={1.2} className="text-violet-200" /></div>
          </section>

          <section id="discussion" className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-brand">Community thread</p><h2 className="mt-1 font-display text-xl font-extrabold text-ink sm:text-2xl">What's on your mind?</h2><p className="mt-1 text-xs text-slate-500">Start a conversation or jump into an existing one.</p></div>
              <div className="rounded-2xl bg-violet-50 px-3 py-2 text-right"><span className="block font-display text-xl font-extrabold text-brand">{totalComments}</span><span className="text-[9px] font-bold uppercase tracking-wider text-violet-500">Comments</span></div>
            </div>
            <div className="mt-5 flex gap-3">
              <img src={currentUser.avatar} alt="Your avatar" className="h-10 w-10 shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1"><CommentComposer onSubmit={addTopLevel} placeholder="Share an idea, ask a question, or start a discussion..." buttonLabel="Post to discussion" /></div>
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div><h2 className="font-display text-lg font-extrabold text-ink">Recent conversations</h2><p className="mt-0.5 text-xs text-slate-500">{totalComments} comments across {comments.length} discussion threads</p></div>
              <div className="flex flex-wrap gap-2">
                <div className="relative min-w-0 flex-1 sm:w-48 sm:flex-none"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search discussions" className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-violet-100" /></div>
                <div className="relative"><SlidersHorizontal size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-8 pr-8 text-xs font-semibold text-slate-600 outline-none focus:border-brand"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="popular">Most liked</option></select><ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" /></div>
              </div>
            </div>

            <div className="space-y-4">
              {visibleComments.length > 0 ? visibleComments.map((comment) => (
                <div key={comment.id} className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card sm:p-6">
                  <CommentItem comment={comment} onReply={addReply} onLike={toggleLike} onDelete={deleteComment} onEdit={editComment} />
                </div>
              )) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-brand"><Search size={21} /></div>
                  <h3 className="mt-3 font-display font-bold text-ink">No discussions found</h3>
                  <p className="mt-1 text-xs text-slate-500">Try another search term or start a new conversation.</p>
                  {search && <button onClick={() => setSearch('')} className="mt-3 text-xs font-bold text-brand hover:underline">Clear search</button>}
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
            <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=85" alt="People sharing ideas around a table" className="h-32 w-full object-cover" />
            <div className="p-5"><div className="flex items-center gap-2 text-brand"><Users size={16} /><span className="text-[10px] font-bold uppercase tracking-[.16em]">Your community</span></div><h3 className="mt-2 font-display text-lg font-extrabold">Better together.</h3><p className="mt-1 text-xs leading-5 text-slate-500">A thoughtful reply can turn a simple comment into a great conversation.</p></div>
          </section>
          <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
            <h3 className="font-display text-sm font-extrabold text-ink">Discussion snapshot</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-violet-50 p-3"><MessageCircle size={17} className="text-brand" /><p className="mt-2 font-display text-xl font-extrabold text-ink">{totalComments}</p><p className="text-[10px] font-semibold text-slate-500">Total comments</p></div>
              <div className="rounded-2xl bg-rose-50 p-3"><Heart size={17} className="text-rose-500" /><p className="mt-2 font-display text-xl font-extrabold text-ink">{totalLikes}</p><p className="text-[10px] font-semibold text-slate-500">Appreciations</p></div>
            </div>
          </section>
          <section id="guidelines" className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
            <h3 className="font-display text-sm font-extrabold text-ink">Community guidelines</h3>
            <ul className="mt-3 space-y-3 text-xs leading-5 text-slate-500">
              <li className="flex gap-2"><span className="font-bold text-brand">01</span> Be kind and respectful to everyone.</li>
              <li className="flex gap-2"><span className="font-bold text-brand">02</span> Keep replies relevant to the conversation.</li>
              <li className="flex gap-2"><span className="font-bold text-brand">03</span> Share helpful ideas and constructive feedback.</li>
            </ul>
          </section>
          <section id="about" className="rounded-3xl bg-[#242044] p-5 text-white shadow-card">
            <div className="flex items-center gap-2 text-violet-200"><Code2 size={16} /><span className="text-[10px] font-bold uppercase tracking-[.16em]">Built with React</span></div>
            <p className="mt-2 text-xs leading-5 text-violet-100/75">Threadly uses a recursive component to render replies inside replies at any nesting depth.</p>
          </section>
        </aside>
      </main>

      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-xl">{toast}</div>}
    </div>
  )
}

export default App