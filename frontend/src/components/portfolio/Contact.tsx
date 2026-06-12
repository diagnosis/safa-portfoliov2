const LINKS = [
    {
        label: 'email',
        value: 'demirkan@safadev.app',
        href: 'mailto:demirkan@safadev.app',
    },
    {
        label: 'github',
        value: 'github.com/diagnosis',
        href: 'https://github.com/diagnosis',
    },
    {
        label: 'linkedin',
        value: 'linkedin.com/in/safa-demirkan-94663b280',
        href: 'https://www.linkedin.com/in/safa-demirkan-94663b280/',
    },

]

export function Contact() {
    return (
        <section id="contact" className="py-24 border-t border-white/[0.04]">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                        <span className="text-white/40 font-mono text-sm">contact</span>
                    </div>

                    <h2 className="text-5xl font-bold text-white leading-tight mb-6">
                        Let&apos;s build something
                        <br />
                        that ships.<span className="text-[#5bbf8a] animate-pulse">_</span>
                    </h2>

                    <p className="text-white/40 text-lg leading-relaxed mb-12">
                        Open to senior & staff full-stack / backend roles, and select freelance work.
                        The fastest way to reach me is below.
                    </p>

                    <div className="space-y-2">
                        {LINKS.map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                target={l.label !== 'email' ? '_blank' : undefined}
                                rel={l.label !== 'email' ? 'noopener noreferrer' : undefined}
                                className="flex items-center justify-between px-5 py-4 rounded-xl border border-white/[0.06] bg-[#161b22] hover:border-[#5bbf8a]/30 hover:bg-[#5bbf8a]/[0.03] transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-white/20 font-mono text-sm w-16">{l.label}</span>
                                    <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
                    {l.value}
                  </span>
                                </div>

                                <span className="text-white/20 group-hover:text-[#5bbf8a] transition-colors text-lg">
                  ↗
                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}