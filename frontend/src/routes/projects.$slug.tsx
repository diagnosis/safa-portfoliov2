import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { projectService } from '@/services/projectService'
import { Nav } from '@/components/portfolio/Nav'
import { Footer } from '@/components/portfolio/Footer'
import { useState } from 'react'

export const Route = createFileRoute('/projects/$slug')({
  component: ProjectDetail,
})

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#5bbf8a] font-mono text-sm">#</span>
          <h2 className="text-white font-bold text-xl">{title}</h2>
        </div>
        {children}
      </div>
  )
}

function ProjectDetail() {
  const { slug } = Route.useParams()
  const [activeScreenshot, setActiveScreenshot] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const res = await projectService.get(slug)
      return res.ok ? res.data.project : null
    },
  })

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#0d1117]">
          <Nav />
          <div className="max-w-4xl mx-auto px-6 pt-28 space-y-4">
            <div className="h-10 bg-[#161b22] rounded animate-pulse w-1/2" />
            <div className="h-4 bg-[#161b22] rounded animate-pulse" />
            <div className="h-4 bg-[#161b22] rounded animate-pulse w-3/4" />
          </div>
        </div>
    )
  }

  if (!data) {
    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/40 font-mono mb-4">project not found</p>
            <Link to="/" className="text-[#5bbf8a]/60 hover:text-[#5bbf8a] font-mono text-sm">
              ← home
            </Link>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <Nav />
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">

          {/* back */}
          <Link to="/" className="text-white/20 hover:text-white/40 font-mono text-xs transition-colors mb-8 block">
            ← back
          </Link>

          {/* header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
                        <span className={`flex items-center gap-1.5 text-xs font-mono ${data.live_url ? 'text-[#5bbf8a]/70' : 'text-white/30'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${data.live_url ? 'bg-[#5bbf8a] animate-pulse' : 'bg-white/20'}`} />
                          {data.live_url ? 'live' : 'source only'}
                        </span>
            </div>
            <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
            {data.description && (
                <p className="text-white/50 text-xl leading-relaxed mb-6">{data.description}</p>
            )}

            {/* links */}
            <div className="flex gap-3 flex-wrap">
              {data.live_url && (
                  <a href={data.live_url} target="_blank" rel="noopener noreferrer"
                     className="px-5 py-2.5 rounded-lg bg-[#5bbf8a] text-[#0d1117] font-semibold text-sm hover:bg-[#5bbf8a]/90 transition-colors">
                    visit site ↗
                  </a>
              )}
              {data.repo_url && (
                  <a href={data.repo_url} target="_blank" rel="noopener noreferrer"
                     className="px-5 py-2.5 rounded-lg border border-white/10 text-white/60 text-sm hover:border-white/20 hover:text-white transition-colors">
                    source ↗
                  </a>
              )}
              {data.app_store_url && (
                  <a href={data.app_store_url} target="_blank" rel="noopener noreferrer"
                     className="px-5 py-2.5 rounded-lg border border-white/10 text-white/60 text-sm hover:border-white/20 hover:text-white transition-colors">
                    app store ↗
                  </a>
              )}
              {data.play_store_url && (
                  <a href={data.play_store_url} target="_blank" rel="noopener noreferrer"
                     className="px-5 py-2.5 rounded-lg border border-white/10 text-white/60 text-sm hover:border-white/20 hover:text-white transition-colors">
                    play store ↗
                  </a>
              )}
            </div>
          </div>

          {/* screenshots */}
          {data.screenshots?.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                  <h2 className="text-white font-bold text-xl">screenshots</h2>
                </div>
                  <div className="bg-[#161b22] border border-white/[0.06] rounded-xl overflow-hidden flex items-center justify-center min-h-[300px] max-h-[600px]">
                      <img
                          src={data.screenshots[activeScreenshot]}
                          alt={`${data.title} screenshot ${activeScreenshot + 1}`}
                          className="max-w-full max-h-[600px] object-contain"
                      />
                  </div>
                {data.screenshots.length > 1 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {data.screenshots.map((src, i) => (
                          <button key={i} onClick={() => setActiveScreenshot(i)}
                                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                                      i === activeScreenshot ? 'border-[#5bbf8a]' : 'border-white/[0.06] hover:border-white/20'
                                  }`}>
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </button>
                      ))}
                    </div>
                )}
              </div>
          )}

          {/* tech stack */}
          <Section title="tech stack">
            <div className="flex flex-wrap gap-2">
              {data.tech_stack.map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/60 text-sm font-mono hover:border-[#5bbf8a]/30 hover:text-white/80 transition-colors">
                                {t}
                            </span>
              ))}
            </div>
          </Section>

          {/* problem */}
          {data.problem && (
              <Section title="problem">
                <p className="text-white/50 leading-relaxed">{data.problem}</p>
              </Section>
          )}

          {/* solution */}
          {data.solution && (
              <Section title="solution">
                <p className="text-white/50 leading-relaxed">{data.solution}</p>
              </Section>
          )}

          {/* features */}
          {data.features?.length > 0 && (
              <Section title="key features">
                <ul className="space-y-2">
                  {data.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[#5bbf8a] mt-1 flex-shrink-0">✓</span>
                        <span className="text-white/50">{f}</span>
                      </li>
                  ))}
                </ul>
              </Section>
          )}

          {/* architecture */}
          {data.architecture && (
              <Section title="architecture">
                <p className="text-white/50 leading-relaxed">{data.architecture}</p>
              </Section>
          )}

          {/* challenges */}
          {data.challenges?.length > 0 && (
              <Section title="challenges">
                <ul className="space-y-3">
                  {data.challenges.map((c, i) => (
                      <li key={i} className="flex items-start gap-3 pl-4 border-l-2 border-[#5bbf8a]/30">
                        <span className="text-white/50">{c}</span>
                      </li>
                  ))}
                </ul>
              </Section>
          )}

          {/* learnings */}
          {data.learnings?.length > 0 && (
              <Section title="what i learned">
                <ul className="space-y-2">
                  {data.learnings.map((l, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[#5bbf8a] mt-1 flex-shrink-0">→</span>
                        <span className="text-white/50">{l}</span>
                      </li>
                  ))}
                </ul>
              </Section>
          )}

        </div>
        <Footer />
      </div>
  )
}