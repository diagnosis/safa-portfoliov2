import { createFileRoute } from '@tanstack/react-router'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import { useState } from 'react'
import type { Project } from '@/types'
import {requireAuth} from "@/lib/routeGueard.ts";
import {uploadService} from "@/services/uploadService.ts";

export const Route = createFileRoute('/admin/projects')({
  beforeLoad: ({ context }) => requireAuth(context.queryClient),
  component: AdminProjects,
})

const EMPTY: Partial<Project> = {
    title: '', slug: '', description: '', body: '',
    tech_stack: [], platforms: [],
    live_url: '', repo_url: '', app_store_url: '', play_store_url: '',
    screenshots: [], features: [], challenges: [], learnings: [],
    featured: false, published: false,
}

function ProjectForm({
                       initial, onSave, onCancel, loading
                     }: {
  initial: Partial<Project>
  onSave: (data: Partial<Project>) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof Project, v: unknown) => setForm(f => ({ ...f, [k]: v }))

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
          <label className="text-white/40 font-mono text-xs mb-1.5 block">description</label>
          <input value={form.description ?? ''} onChange={e => set('description', e.target.value)}
                 className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
        </div>

        <div>
          <label className="text-white/40 font-mono text-xs mb-1.5 block">body (markdown)</label>
          <textarea value={form.body ?? ''} onChange={e => set('body', e.target.value)} rows={4}
                    className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors resize-none" />
        </div>
        <div>
          <label className="text-white/40 font-mono text-xs mb-1.5 block">image</label>
          <div className="flex gap-2">
            <input value={form.image_url ?? ''} onChange={e => set('image_url', e.target.value)}
                   placeholder="or paste url"
                   className="flex-1 bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
            <label className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 text-sm font-mono cursor-pointer hover:border-[#5bbf8a]/40 hover:text-white/60 transition-colors">
              upload
              <input type="file" accept=".webp,.jpg,.jpeg,.png" className="hidden"
                     onChange={async e => {
                       const file = e.target.files?.[0]
                       if (!file) return
                       const url = await uploadService.upload(file)
                       if (url) set('image_url', url)
                     }} />
            </label>
          </div>
        </div>
          {/* after body textarea */}
          <div>
              <label className="text-white/40 font-mono text-xs mb-1.5 block">problem</label>
              <textarea value={form.problem ?? ''} onChange={e => set('problem', e.target.value)} rows={3}
                        className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors resize-none" />
          </div>

          <div>
              <label className="text-white/40 font-mono text-xs mb-1.5 block">solution</label>
              <textarea value={form.solution ?? ''} onChange={e => set('solution', e.target.value)} rows={3}
                        className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors resize-none" />
          </div>

          <div>
              <label className="text-white/40 font-mono text-xs mb-1.5 block">architecture</label>
              <textarea value={form.architecture ?? ''} onChange={e => set('architecture', e.target.value)} rows={3}
                        className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors resize-none" />
          </div>

          <div>
              <label className="text-white/40 font-mono text-xs mb-1.5 block">features (one per line)</label>
              <textarea value={form.features?.join('\n') ?? ''} rows={4}
                        onChange={e => set('features', e.target.value.split('\n').filter(Boolean))}
                        className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors resize-none" />
          </div>

          <div>
              <label className="text-white/40 font-mono text-xs mb-1.5 block">challenges (one per line)</label>
              <textarea value={form.challenges?.join('\n') ?? ''} rows={4}
                        onChange={e => set('challenges', e.target.value.split('\n').filter(Boolean))}
                        className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors resize-none" />
          </div>

          <div>
              <label className="text-white/40 font-mono text-xs mb-1.5 block">learnings (one per line)</label>
              <textarea value={form.learnings?.join('\n') ?? ''} rows={4}
                        onChange={e => set('learnings', e.target.value.split('\n').filter(Boolean))}
                        className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors resize-none" />
          </div>

          <div>
              <label className="text-white/40 font-mono text-xs mb-1.5 block">screenshots</label>
              <div className="space-y-2">
                  {(form.screenshots ?? []).map((url, i) => (
                      <div key={i} className="flex gap-2 items-center">
                          <input value={url} onChange={e => {
                              const updated = [...(form.screenshots ?? [])]
                              updated[i] = e.target.value
                              set('screenshots', updated)
                          }}
                                 className="flex-1 bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
                          <button onClick={() => set('screenshots', (form.screenshots ?? []).filter((_, j) => j !== i))}
                                  className="text-red-400/40 hover:text-red-400 text-xs font-mono transition-colors">
                              ✕
                          </button>
                      </div>
                  ))}
                  <div className="flex gap-2">
                      <button onClick={() => set('screenshots', [...(form.screenshots ?? []), ''])}
                              className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 text-xs font-mono hover:border-[#5bbf8a]/40 hover:text-white/60 transition-colors">
                          + add url
                      </button>
                      <label className="px-3 py-2 rounded-lg border border-white/[0.08] text-white/40 text-xs font-mono cursor-pointer hover:border-[#5bbf8a]/40 hover:text-white/60 transition-colors">
                          upload image
                          <input type="file" accept=".webp,.jpg,.jpeg,.png" className="hidden"
                                 onChange={async e => {
                                     const file = e.target.files?.[0]
                                     if (!file) return
                                     const url = await uploadService.upload(file)
                                     if (url) set('screenshots', [...(form.screenshots ?? []), url])
                                 }} />
                      </label>
                  </div>
              </div>
          </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/40 font-mono text-xs mb-1.5 block">tech stack (comma separated)</label>
            <input
                value={form.tech_stack?.join(', ') ?? ''}
                onChange={e => set('tech_stack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
          </div>
          <div>
            <label className="text-white/40 font-mono text-xs mb-1.5 block">platforms (comma separated)</label>
            <input
                value={form.platforms?.join(', ') ?? ''}
                onChange={e => set('platforms', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/40 font-mono text-xs mb-1.5 block">live url</label>
            <input value={form.live_url ?? ''} onChange={e => set('live_url', e.target.value)}
                   className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
          </div>
          <div>
            <label className="text-white/40 font-mono text-xs mb-1.5 block">repo url</label>
            <input value={form.repo_url ?? ''} onChange={e => set('repo_url', e.target.value)}
                   className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-white/40 font-mono text-xs mb-1.5 block">app store url</label>
            <input value={form.app_store_url ?? ''} onChange={e => set('app_store_url', e.target.value)}
                   className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
          </div>
          <div>
            <label className="text-white/40 font-mono text-xs mb-1.5 block">play store url</label>
            <input value={form.play_store_url ?? ''} onChange={e => set('play_store_url', e.target.value)}
                   className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm font-mono outline-none focus:border-[#5bbf8a]/40 transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured ?? false}
                   onChange={e => set('featured', e.target.checked)}
                   className="accent-[#5bbf8a]" />
            <span className="text-white/40 font-mono text-xs">featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published ?? false}
                   onChange={e => set('published', e.target.checked)}
                   className="accent-[#5bbf8a]" />
            <span className="text-white/40 font-mono text-xs">published</span>
          </label>
        </div>

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

function AdminProjects() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: async () => {
      const res = await projectService.adminList()
      return res.ok ? res.data.projects ?? [] : []
    },
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'projects'] })

    const create = useMutation({
        mutationFn: (data: Partial<Project>) => projectService.create({
            ...data,
            screenshots: data.screenshots ?? [],
            features: data.features ?? [],
            challenges: data.challenges ?? [],
            learnings: data.learnings ?? [],
            tech_stack: data.tech_stack ?? [],
            platforms: data.platforms ?? [],
        }),
        onSuccess: () => { invalidate(); setShowForm(false) },
    })

    const update = useMutation({
        mutationFn: (data: Partial<Project>) => projectService.update(editing!.id, {
            ...data,
            screenshots: data.screenshots ?? [],
            features: data.features ?? [],
            challenges: data.challenges ?? [],
            learnings: data.learnings ?? [],
            tech_stack: data.tech_stack ?? [],
            platforms: data.platforms ?? [],
        }),
        onSuccess: () => { invalidate(); setEditing(null) },
    })

  const remove = useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: invalidate,
  })

  return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-white font-bold text-2xl">Projects</h1>
              <p className="text-white/30 text-sm font-mono mt-1">{projects.length} total</p>
            </div>
            {!showForm && !editing && (
                <button onClick={() => setShowForm(true)}
                        className="px-4 py-2 rounded-lg bg-[#5bbf8a]/20 border border-[#5bbf8a]/30 text-[#5bbf8a] text-sm font-mono hover:bg-[#5bbf8a]/30 transition-colors">
                  + new project
                </button>
            )}
          </div>

          {showForm && (
              <div className="mb-6">
                <h2 className="text-white/60 font-mono text-sm mb-4"># new project</h2>
                <ProjectForm
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
          ) : (
              <div className="space-y-3">
                {projects.map(p => (
                    <div key={p.id}>
                      {editing?.id === p.id ? (
                          <div className="mb-2">
                            <h2 className="text-white/60 font-mono text-sm mb-4"># editing: {p.title}</h2>
                            <ProjectForm
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
                              {p.featured && <span className="text-[#5bbf8a]/40 font-mono text-xs">featured</span>}
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
                                  onClick={() => { if (confirm(`delete ${p.title}?`)) remove.mutate(p.id) }}
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