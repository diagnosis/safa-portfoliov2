const STACK = {
    Languages: ['Go', 'TypeScript', 'JavaScript', 'Java', 'Kotlin', 'SQL'],
    Frontend: ['React', 'Next.js', 'React Native', 'TanStack Router', 'TanStack Query', 'Tailwind CSS', 'Zustand', 'Vite'],
    'Backend & Database': ['Go (Chi, pgx)', 'REST APIs', 'PostgreSQL', 'Node.js', 'Docker', 'Nginx'],
    'Testing & QA': ['Playwright', 'Selenium WebDriver', 'Appium', 'Cucumber', 'JUnit', 'Espresso', 'Jest'],
    'CI/CD & DevOps': ['GitHub Actions', 'Jenkins', 'GitLab CI/CD', 'AWS', 'Docker', 'Kubernetes', 'Linux'],
    Mobile: ['React Native', 'Expo', 'EAS Build', 'App Store', 'iOS', 'Android'],
}

export function TechStack() {
    return (
        <section id="stack" className="py-24 border-t border-white/[0.04]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                        <span className="text-white/40 font-mono text-sm">tech-stack</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white">Tools of the trade</h2>
                    <p className="text-white/40 mt-2">The kit I reach for to take an idea from schema to deploy.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(STACK).map(([cat, items]) => (
                        <div key={cat} className="bg-[#161b22] border border-white/[0.06] rounded-xl p-6">
                            <div className="text-[#5bbf8a]/60 font-mono text-xs mb-4 uppercase tracking-widest">{cat}</div>
                            <div className="flex flex-wrap gap-2">
                                {items.map(item => (
                                    <span key={item} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/60 text-sm font-mono hover:border-[#5bbf8a]/30 hover:text-white/80 transition-colors">
                    {item}
                  </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}