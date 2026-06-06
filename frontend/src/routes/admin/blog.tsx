import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService } from '@/services/blogService'
import { useState } from 'react'
import type { BlogPost } from '@/types'
import {requireAuth} from "@/lib/routeGueard.ts";

export const Route = createFileRoute('/admin/blog')({
  beforeLoad: ({ context }) => requireAuth(context.queryClient),
  component: AdminBlog,
})

const EMPTY: Partial<BlogPost> = {
  title: '', slug: '', excerpt: '', body: '', published: false,
}

function BlogForm({
                    initial, onSave, onCancel, loading
                  }: {
  initial: Partial<BlogPost>
  onSave: (data: Partial<BlogPost>) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof BlogPost, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
      <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/40 font-mono text-xs mb-1.5 block">title *</label>
            <input value={form.title ?? ''} onChange={e => set('title', e.target.value)}
                   className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
          </div>
          <div>
            <label className="text-white/40 font-mono text-xs mb-1.5 block">slug *</label>
            <input value={form.slug ?? ''} onChange={e => set('slug', e.target.value)}
                   className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
          </div>
        </div>

        <div>
          <label className="text-white/40 font-mono text-xs mb-1.5 block">excerpt</label>
          <input value={form.excerpt ?? ''} onChange={e => set('excerpt', e.target.value)}
                 className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
        </div>

        <div>
          <label className="text-white/40 font-mono text-xs mb-1.5 block">body (markdown)</label>
          <textarea value={form.body ?? ''} onChange={e => set('body', e.target.value)} rows={8}
                    className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors resize-none" />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published ?? false}
                 onChange={e => set('published', e.target.checked)}
                 className="accent-[#5bbf8a]" />
          <span className="text-white/40 font-mono text-xs">published</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button onClick={() => onSave(form)} disabled={loading || !form.title || !form.slug}
                  className="px-5 py-2 rounded-lg bg-[#5bbf8a]/20 border border-[#5bbf8a]/30 text-[#5bbf8a] text-sm font-mono hover:bg-[#5bbf8a]/30 transition-colors disabled:opacity-40">
            {loading ? 'saving...' : 'save →'}
          </button>
          <button onClick={onCancel}
                  className="px-5 py-2 rounded-lg border border-white/[0.06] text-white/30 text-sm font-mono hover:text-white/50 transition-colors">
            cancel
          </button>
        </div>
      </div>
  )
}

function AdminBlog() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin', 'blog'],
    queryFn: async () => {
      const res = await blogService.adminList()
      return res.ok ? res.data.posts ?? [] : []
    },
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'blog'] })

  const create = useMutation({
    mutationFn: (data: Partial<BlogPost>) => blogService.create(data),
    onSuccess: () => { invalidate(); setShowForm(false) },
  })

  const update = useMutation({
    mutationFn: (data: Partial<BlogPost>) => blogService.update(editing!.id, data),
    onSuccess: () => { invalidate(); setEditing(null) },
  })

  const remove = useMutation({
    mutationFn: (id: string) => blogService.delete(id),
    onSuccess: invalidate,
  })

  return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white font-bold text-2xl">Blog</h1>
              <p className="text-white/30 text-sm font-mono mt-1">{posts.length} total</p>
            </div>
            {!showForm && !editing && (
                <button onClick={() => setShowForm(true)}
                        className="px-4 py-2 rounded-lg bg-[#5bbf8a]/20 border border-[#5bbf8a]/30 text-[#5bbf8a] text-sm font-mono hover:bg-[#5bbf8a]/30 transition-colors">
                  + new post
                </button>
            )}
          </div>

          {showForm && (
              <div className="mb-6">
                <h2 className="text-white/60 font-mono text-sm mb-4"># new post</h2>
                <BlogForm
                    initial={EMPTY}
                    onSave={data => create.mutate(data)}
                    onCancel={() => setShowForm(false)}
                    loading={create.isPending}
                />
              </div>
          )}

          {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-[#161b22] rounded-xl animate-pulse" />)}
              </div>
          ) : posts.length === 0 && !showForm ? (
              <div className="text-center py-16">
                <p className="text-white/20 font-mono text-sm">no posts yet</p>
                <button onClick={() => setShowForm(true)}
                        className="mt-4 text-[#5bbf8a]/60 hover:text-[#5bbf8a] text-xs font-mono transition-colors">
                  + write your first post
                </button>
              </div>
          ) : (
              <div className="space-y-3">
                {posts.map(p => (
                    <div key={p.id}>
                      {editing?.id === p.id ? (
                          <div className="mb-2">
                            <h2 className="text-white/60 font-mono text-sm mb-4"># editing: {p.title}</h2>
                            <BlogForm
                                initial={editing}
                                onSave={data => update.mutate(data)}
                                onCancel={() => setEditing(null)}
                                loading={update.isPending}
                            />
                          </div>
                      ) : (
                          <div className="flex items-center justify-between px-5 py-4 bg-[#161b22] border border-white/[0.06] rounded-xl hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                              <span className="text-white/60 text-sm">{p.title}</span>
                              <span className="text-white/20 font-mono text-xs">{p.slug}</span>
                              {p.excerpt && (
                                  <span className="text-white/20 text-xs truncate max-w-xs">{p.excerpt}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${
                          p.published
                              ? 'bg-[#5bbf8a]/10 border-[#5bbf8a]/20 text-[#5bbf8a]/70'
                              : 'bg-white/[0.03] border-white/[0.06] text-white/20'
                      }`}>
                        {p.published ? 'live' : 'draft'}
                      </span>
                              <button onClick={() => setEditing(p)}
                                      className="text-white/20 hover:text-white/60 text-xs font-mono transition-colors">
                                edit
                              </button>
                              <button
                                  onClick={() => { if (confirm(`delete "${p.title}"?`)) remove.mutate(p.id) }}
                                  className="text-white/20 hover:text-red-400/60 text-xs font-mono transition-colors">
                                delete
                              </button>
                            </div>
                          </div>
                      )}
                    </div>
                ))}
              </div>
          )}
        </div>
      </AdminLayout>
  )
}