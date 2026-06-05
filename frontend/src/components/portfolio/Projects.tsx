import type { Project } from '@/types'

export function Projects({ projects, loading }: { projects: Project[], loading: boolean }) {
    return <section id="projects" className="py-24"><div className="max-w-6xl mx-auto px-6"><p className="text-white/30">{loading ? 'loading...' : `${projects.length} projects`}</p></div></section>
}