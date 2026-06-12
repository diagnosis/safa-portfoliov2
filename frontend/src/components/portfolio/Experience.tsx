const EXPERIENCE = [
    {
        when: '2025 — present',
        role: 'Software Engineer',
        company: 'Independent / Freelance',
        now: true,
        desc: 'Designing and shipping production full-stack products in Go + React — LuxSUV, DeployWatch and more. Owning the whole path: schema, API, real-time, frontend and deploy.',
    },
    {
        when: '2019 — 2025',
        role: 'Software Development Engineer in Test',
        company: 'Wizards of the Coast',
        now: false,
        desc: 'Sole SDET owning the entire automation strategy across web, Android, and iOS. Built mobile automation practice from scratch, led Playwright migration (+40% efficiency), and owned CI/CD pipelines on Jenkins, GitLab, AWS and Kubernetes.',
    },
    {
        when: '2018 — 2019',
        role: 'Software Development Engineer in Test',
        company: 'Providence Health Services',
        now: false,
        desc: 'Built Android/iOS/Web automation framework from scratch, increasing test coverage by 50% in 4 months. Drove Agile test strategy via Bitrise CI.',
    },
    {
        when: '2017 — 2018',
        role: 'Software Development Engineer in Test',
        company: 'Sempra Energy',
        now: false,
        desc: 'Identified untested coverage areas and delivered WebDriver/Cucumber automation increasing coverage by 40% in 3 months.',
    },
    {
        when: '2017',
        role: 'SDET / Test Lead',
        company: 'Hilton',
        now: false,
        desc: 'Led test strategy end-to-end with Jenkins CI/CD. Built and maintained Selenium/Appium scripts for web and mobile, enhancing coverage by 60%.',
    },
    {
        when: '2015 — 2017',
        role: 'Software Development Engineer in Test',
        company: 'American Express',
        now: false,
        desc: 'Built and maintained Selenium WebDriver automation in Jenkins CI. Developed internal tooling that significantly reduced manual QA effort.',
    },
]

const STATS = [
    { n: '9+', label: 'years in test automation & quality engineering' },
    { n: '4', label: 'full-stack products shipped to production' },
    { n: '2×', label: 'live apps serving real users today' },
]

export function Experience() {
    return (
        <section id="experience" className="py-24 border-t border-white/[0.04]">
            <div className="max-w-6xl mx-auto px-6">

                {/* section head */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                        <span className="text-white/40 font-mono text-sm">experience</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white">From breaking software to building it</h2>
                    <p className="text-white/40 mt-2">Nine years making sure software works — now making the software.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-12">

                    {/* stats */}
                    <div className="flex flex-col gap-6">
                        {STATS.map(s => (
                            <div key={s.n} className="bg-[#161b22] border border-white/[0.06] rounded-xl p-6">
                                <div className="text-4xl font-bold text-[#5bbf8a] mb-2">{s.n}</div>
                                <div className="text-white/40 text-sm leading-relaxed">{s.label}</div>
                            </div>
                        ))}

                        {/* education */}
                        <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-6">
                            <div className="text-[#5bbf8a]/60 font-mono text-xs mb-4 uppercase tracking-widest">Education</div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-white/70 text-sm font-medium">Northwestern University</div>
                                    <div className="text-white/30 text-xs">MS, Biomedical Engineering · GPA 3.5</div>
                                </div>
                                <div>
                                    <div className="text-white/70 text-sm font-medium">Yeditepe University</div>
                                    <div className="text-white/30 text-xs">BS, Biomedical Engineering · GPA 3.6</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* timeline */}
                    <div className="relative">
                        <div className="absolute left-0 top-2 bottom-2 w-px bg-white/[0.06]" />
                        <div className="space-y-8">
                            {EXPERIENCE.map((e, i) => (
                                <div key={i} className="relative pl-8">
                                    {/* node */}
                                    <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full border ${
                                        e.now
                                            ? 'bg-[#5bbf8a] border-[#5bbf8a]'
                                            : 'bg-[#161b22] border-white/20'
                                    }`} />

                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-white/20 font-mono text-xs">{e.when}</span>
                                        {e.now && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5bbf8a]/10 border border-[#5bbf8a]/30 text-[#5bbf8a] font-mono">
                        NOW
                      </span>
                                        )}
                                    </div>
                                    <div className="text-white font-semibold text-sm mb-0.5">{e.role}</div>
                                    <div className="text-[#5bbf8a]/60 text-xs font-mono mb-2">{e.company}</div>
                                    <p className="text-white/40 text-sm leading-relaxed">{e.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}