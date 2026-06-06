import type { Project } from '@/types'
import { Link } from "@tanstack/react-router";


const STACK_COLORS: Record<string, string> = {
    'Go': 'bg-[#00acd7]/10 text-[#00acd7]/70 border-[#00acd7]/20',
    'React': 'bg-[#61dafb]/10 text-[#61dafb]/70 border-[#61dafb]/20',
    'React Native': 'bg-[#61dafb]/10 text-[#61dafb]/70 border-[#61dafb]/20',
    'PostgreSQL': 'bg-[#336791]/10 text-[#336791]/70 border-[#336791]/20',
    'TypeScript': 'bg-[#3178c6]/10 text-[#3178c6]/70 border-[#3178c6]/20',
    'Flutter': 'bg-[#54c5f8]/10 text-[#54c5f8]/70 border-[#54c5f8]/20',
}

const DEFAULT_CHIP = 'bg-white/[0.04] text-white/40 border-white/[0.08]'

function Chip({ label }: { label: string }) {
    return (
        <span className={`text-[11px] px-2 py-0.5 rounded-full border font-mono ${STACK_COLORS[label] ?? DEFAULT_CHIP}`}>
      {label}
    </span>
    )
}
function ProjectCard({ project, index }: { project: Project; index: number }) {
    const idx = String(index + 1).padStart(2, '0')
    const isLive = !!project.live_url

    return (
        <Link to="/projects/$slug" params={{ slug: project.slug }} key={project.id}>
        <article className="group relative bg-[#161b22] border border-white/[0.06] rounded-xl overflow-hidden hover:border-[#5bbf8a]/30 transition-all duration-300 cursor-pointer">

            {/* image */}
            {project.image_url ? (
                <div className="h-44 overflow-hidden">
                    <img src={project.image_url} alt={project.title}
                         className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
                </div>
            ) : (
                <div className="h-44 bg-[#0d1117] flex items-center justify-center border-b border-white/[0.04]">
                    <span className="text-white/10 font-mono text-4xl font-bold">{idx}</span>
                </div>
            )}

            <div className="p-5">
                {/* top row */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-white/20 font-mono text-[11px]">PROJECT_{idx}</span>
                    <span className={`flex items-center gap-1.5 text-[11px] font-mono ${isLive ? 'text-[#5bbf8a]/70' : 'text-white/30'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-[#5bbf8a] animate-pulse' : 'bg-white/20'}`} />
                        {isLive ? 'live' : 'source'}
          </span>
                </div>

                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#5bbf8a] transition-colors">
                    {project.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                </p>

                {/* chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech_stack.slice(0, 4).map(s => <Chip key={s} label={s} />)}
                    {project.tech_stack.length > 4 && (
                        <span className="text-[11px] text-white/20 font-mono self-center">+{project.tech_stack.length - 4}</span>
                    )}
                </div>

                {/* links */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.04]">
                    {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                           className="text-[#5bbf8a]/70 hover:text-[#5bbf8a] text-xs font-mono transition-colors"
                           onClick={e => e.stopPropagation()}>
                            visit ↗
                        </a>
                    )}
                    {project.repo_url && (
                        <a href={project.repo_url} target="_blank" rel="noopener noreferrer"
                           className="text-white/30 hover:text-white/60 text-xs font-mono transition-colors"
                           onClick={e => e.stopPropagation()}>
                            source ↗
                        </a>
                    )}
                    {project.app_store_url && (
                        <a href={project.app_store_url} target="_blank" rel="noopener noreferrer"
                           className="text-white/30 hover:text-white/60 text-xs font-mono transition-colors"
                           onClick={e => e.stopPropagation()}>
                            app store ↗
                        </a>
                    )}
                </div>
            </div>

            {/* hover glow */}
            <div className="absolute inset-0 bg-[#5bbf8a]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </article>
        </Link>
    )
}



export function Projects({ projects, loading }: { projects: Project[]; loading: boolean }) {
    return (
        <section id="projects" className="py-24">
            <div className="max-w-6xl mx-auto px-6">

                {/* section head */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                            <span className="text-white/40 font-mono text-sm">selected-work</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white">Things I've shipped</h2>
                        <p className="text-white/40 mt-2 max-w-lg">
                            Real products in production — not toy demos.
                        </p>
                    </div>
                    <span className="text-white/20 font-mono text-sm">
            {loading ? '...' : `${projects.length} projects · 2024–2025`}
          </span>
                </div>

                {/* grid */}
                {loading ? (
                    <div className="grid grid-cols-2 gap-5">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="h-72 bg-[#161b22] border border-white/[0.06] rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-5">
                        {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
                    </div>
                )}
            </div>
        </section>
    )
}