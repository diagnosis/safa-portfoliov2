import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/services/blogService'
import { Nav } from '@/components/portfolio/Nav'
import { Footer } from '@/components/portfolio/Footer'

export const Route = createFileRoute('/blog/')({
    component: BlogList,
})

function BlogList() {
    const { data, isLoading } = useQuery({
        queryKey: ['blog', 'public'],
        queryFn: async () => {
            const res = await blogService.list()
            return res.ok ? res.data.posts ?? [] : []
        },
    })

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            <Nav />
            <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                        <span className="text-white/40 font-mono text-sm">blog</span>
                    </div>
                    <h1 className="text-4xl font-bold">Writing</h1>
                    <p className="text-white/40 mt-2">Thoughts on engineering, systems, and shipping.</p>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1,2,3].map(i => <div key={i} className="h-24 bg-[#161b22] rounded-xl animate-pulse" />)}
                    </div>
                ) : data?.length === 0 ? (
                    <p className="text-white/20 font-mono text-sm">no posts yet</p>
                ) : (
                    <div className="space-y-3">
                        {data?.map(post => (
                            <Link key={post.id} to="/blog/$slug" params={{ slug: post.slug }}
                                  className="block px-6 py-5 bg-[#161b22] border border-white/[0.06] rounded-xl hover:border-[#5bbf8a]/30 transition-all group">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-white font-semibold group-hover:text-[#5bbf8a] transition-colors mb-1">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="text-white/40 text-sm leading-relaxed">{post.excerpt}</p>
                                        )}
                                    </div>
                                    <span className="text-white/20 group-hover:text-[#5bbf8a] transition-colors text-lg flex-shrink-0">↗</span>
                                </div>
                                <div className="mt-3 text-white/20 font-mono text-xs">
                                    {new Date(post.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}