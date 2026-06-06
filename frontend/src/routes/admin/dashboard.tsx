import { createFileRoute } from '@tanstack/react-router'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { useQuery } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import { blogService } from '@/services/blogService'
import {requireAuth} from "@/lib/routeGueard.ts";

export const Route = createFileRoute('/admin/dashboard')({
  beforeLoad: ({ context }) => requireAuth(context.queryClient),
  component: AdminDashboard,
})

function AdminDashboard() {
  const projects = useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: async () => {
      const res = await projectService.adminList()
      return res.ok ? res.data.projects ?? [] : []
    },
  })

  const posts = useQuery({
    queryKey: ['admin', 'blog'],
    queryFn: async () => {
      const res = await blogService.adminList()
      return res.ok ? res.data.posts ?? [] : []
    },
  })

  const stats = [
    { label: 'total projects', value: projects.data?.length ?? '–' },
    { label: 'published projects', value: projects.data?.filter(p => p.published).length ?? '–' },
    { label: 'blog posts', value: posts.data?.length ?? '–' },
    { label: 'published posts', value: posts.data?.filter(p => p.published).length ?? '–' },
  ]

  return (
      <AdminLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-white font-bold text-2xl">Dashboard</h1>
            <p className="text-white/30 text-sm font-mono mt-1">portfolio overview</p>
          </div>

          {/* stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
                <div key={s.label} className="bg-[#161b22] border border-white/[0.06] rounded-xl p-5">
                  <div className="text-3xl font-bold text-[#5bbf8a] mb-1">{s.value}</div>
                  <div className="text-white/30 text-xs font-mono">{s.label}</div>
                </div>
            ))}
          </div>

          {/* recent projects */}
          <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white/70 font-mono text-sm"># projects</h2>
              <a href="/admin/projects" className="text-[#5bbf8a]/60 hover:text-[#5bbf8a] text-xs font-mono transition-colors">
                manage →
              </a>
            </div>
            <div className="space-y-2">
              {projects.data?.map(p => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-white/60 text-sm">{p.title}</span>
                    <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono ${p.featured ? 'text-[#5bbf8a]/60' : 'text-white/20'}`}>
                    {p.featured ? 'featured' : ''}
                  </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${
                          p.published
                              ? 'bg-[#5bbf8a]/10 border-[#5bbf8a]/20 text-[#5bbf8a]/70'
                              : 'bg-white/[0.03] border-white/[0.06] text-white/20'
                      }`}>
                    {p.published ? 'live' : 'draft'}
                  </span>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* recent posts */}
          <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white/70 font-mono text-sm"># blog</h2>
              <a href="/admin/blog" className="text-[#5bbf8a]/60 hover:text-[#5bbf8a] text-xs font-mono transition-colors">
                manage →
              </a>
            </div>
            {posts.data?.length === 0 ? (
                <p className="text-white/20 text-sm font-mono">no posts yet</p>
            ) : (
                <div className="space-y-2">
                  {posts.data?.map(p => (
                      <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                        <span className="text-white/60 text-sm">{p.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${
                            p.published
                                ? 'bg-[#5bbf8a]/10 border-[#5bbf8a]/20 text-[#5bbf8a]/70'
                                : 'bg-white/[0.03] border-white/[0.06] text-white/20'
                        }`}>
                    {p.published ? 'live' : 'draft'}
                  </span>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </AdminLayout>
  )
}