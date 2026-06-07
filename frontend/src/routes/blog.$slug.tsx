import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/services/blogService.ts'
import { Nav } from '@/components/portfolio/Nav.tsx'
import { Footer } from '@/components/portfolio/Footer.tsx'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'  // tables, strikethrough, code blocks

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export const Route = createFileRoute('/blog/$slug')({
    component: BlogPost,
})

function BlogPost() {
    const { slug } = Route.useParams()

    const { data, isLoading } = useQuery({
        queryKey: ['blog', slug],
        queryFn: async () => {
            const res = await blogService.get(slug)
            return res.ok ? res.data.post : null
        },
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0d1117]">
                <Nav />
                <div className="max-w-3xl mx-auto px-6 pt-28">
                    <div className="h-8 bg-[#161b22] rounded animate-pulse mb-4 w-2/3" />
                    <div className="space-y-3">
                        {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-[#161b22] rounded animate-pulse" />)}
                    </div>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/40 font-mono mb-4">post not found</p>
                    <Link to="/blog" className="text-[#5bbf8a]/60 hover:text-[#5bbf8a] font-mono text-sm transition-colors">
                        ← back to blog
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            <Nav />
            <article className="max-w-3xl mx-auto px-6 pt-28 pb-24">
                <Link to="/blog" className="text-white/20 hover:text-white/40 font-mono text-xs transition-colors mb-8 block">
                    ← blog
                </Link>

                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
                    {data.excerpt && (
                        <p className="text-white/50 text-lg leading-relaxed mb-4">{data.excerpt}</p>
                    )}
                    <div className="text-white/20 font-mono text-xs">
                        {new Date(data.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </div>
                </header>

                {data.body && (
                    <div className="prose prose-invert prose-lg max-w-none
        prose-headings:text-white prose-headings:font-bold
        prose-p:text-white/60 prose-p:leading-relaxed
        prose-a:text-[#5bbf8a] prose-a:no-underline hover:prose-a:underline
        prose-code:text-[#5bbf8a] prose-code:bg-[#161b22] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-white/[0.06]
        prose-strong:text-white
        prose-blockquote:border-[#5bbf8a] prose-blockquote:text-white/40">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={oneDark}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{
                                                background: '#161b22',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                borderRadius: '6px',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>{children}</code>
                                    )
                                },
                            }}
                        >
                            {data.body}
                        </ReactMarkdown>
                    </div>
                )}
            </article>
            <Footer />
        </div>
    )
}