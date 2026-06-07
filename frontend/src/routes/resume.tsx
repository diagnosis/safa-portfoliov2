import { createFileRoute } from '@tanstack/react-router'
import { Nav } from '@/components/portfolio/Nav'
import { Footer } from '@/components/portfolio/Footer'

export const Route = createFileRoute('/resume')({
    component: Resume,
})

const SKILLS = {
    Languages: ['Go', 'TypeScript', 'JavaScript', 'Java', 'Kotlin', 'SQL'],
    Frontend: ['React', 'Next.js', 'TanStack Router', 'TanStack Query', 'Tailwind CSS', 'Vite', 'Zustand'],
    'Backend & Database': ['Go (Chi, pgx)', 'REST APIs', 'PostgreSQL', 'Node.js', 'Docker', 'Nginx'],
    'Testing / QA': ['Playwright', 'Selenium WebDriver', 'Appium', 'Cucumber', 'JUnit', 'Espresso', 'Jest'],
    'CI/CD & DevOps': ['GitHub Actions', 'Jenkins', 'GitLab CI/CD', 'AWS', 'Docker', 'Kubernetes', 'Linux'],
    Mobile: ['React Native', 'Expo', 'EAS Build', 'App Store Submission', 'iOS', 'Android'],
}

const EXPERIENCE = [
    {
        company: 'Independent / Freelance',
        role: 'Software Engineer',
        period: '2024 — present',
        now: true,
        bullets: [
            'Designing and shipping production full-stack products in Go + React — LuxSUV, DeployWatch and more.',
            'Owning the whole path: schema, API, real-time, frontend and deploy.',
            'Built and published React Native/Expo driver app to the App Store via EAS Build.',
        ],
    },
    {
        company: 'Wizards of the Coast',
        role: 'Software Development Engineer in Test',
        period: 'Jan 2019 — May 2025',
        now: false,
        bullets: [
            'Sole SDET owning entire automation strategy across web, Android, and iOS from the ground up.',
            'Established Android and iOS automation practice from scratch — grew mobile test coverage by 40% in 6 months.',
            'Sole owner of CI/CD for test automation: Jenkins, GitLab CI/CD pipelines on AWS, Docker, and Kubernetes.',
            'Drove BDD framework adoption (Cucumber, Selenium, Appium) — reducing defects by 25% within one year.',
            'Led migration to Playwright for web automation — boosting test efficiency by 40% in 6 months.',
        ],
    },
    {
        company: 'Providence Health Services',
        role: 'Software Development Engineer in Test',
        period: 'Jul 2018 — Jan 2019',
        now: false,
        bullets: [
            'Built Android/iOS/Web automation framework from scratch, increasing test coverage by 50% in 4 months.',
            'Automated deep linking and parallel mobile tests; Bitrise CI reduced system downtime by 30%.',
        ],
    },
    {
        company: 'Sempra Energy',
        role: 'Software Development Engineer in Test',
        period: 'Nov 2017 — May 2018',
        now: false,
        bullets: [
            'Delivered WebDriver/Cucumber automation increasing coverage by 40% in 3 months.',
        ],
    },
    {
        company: 'Hilton',
        role: 'SDET / Test Lead',
        period: 'Mar 2017 — Nov 2017',
        now: false,
        bullets: [
            'Led test strategy end-to-end with Jenkins CI/CD; Selenium/Appium scripts enhanced coverage by 60%.',
        ],
    },
    {
        company: 'American Express',
        role: 'Software Development Engineer in Test',
        period: 'Nov 2015 — Jan 2017',
        now: false,
        bullets: [
            'Built and maintained Selenium WebDriver automation in Jenkins CI; developed internal tooling reducing manual QA effort significantly.',
        ],
    },
]

function Resume() {
    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            <Nav />
            <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">

                {/* header */}
                <div className="flex items-start justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                            <span className="text-white/40 font-mono text-sm">resume</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Safa Demirkan</h1>
                        <p className="text-white/40">Renton, WA · demirkan@safadev.app</p>
                        <div className="flex gap-4 mt-3">
                            <a href="https://github.com/diagnosis" target="_blank" rel="noopener noreferrer"
                               className="text-[#5bbf8a]/60 hover:text-[#5bbf8a] font-mono text-xs transition-colors">
                                github.com/diagnosis ↗
                            </a>
                            <a href="https://linkedin.com/in/safa-demirkan-94663b280" target="_blank" rel="noopener noreferrer"
                               className="text-[#5bbf8a]/60 hover:text-[#5bbf8a] font-mono text-xs transition-colors">
                                linkedin ↗
                            </a>
                        </div>
                    </div>
                    <a href="https://portfolio-api.safadev.app/uploads/safa_demirkan_resume.pdf"
                       target="_blank" rel="noopener noreferrer"
                       className="px-5 py-2.5 rounded-lg bg-[#5bbf8a]/20 border border-[#5bbf8a]/30 text-[#5bbf8a] text-sm font-mono hover:bg-[#5bbf8a]/30 transition-colors flex-shrink-0">
                        download pdf ↓
                    </a>
                </div>

                {/* summary */}
                <div className="mb-12 p-6 bg-[#161b22] border border-white/[0.06] rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                        <span className="text-white/60 font-mono text-sm">summary</span>
                    </div>
                    <p className="text-white/50 leading-relaxed">
                        Software Engineer with 9+ years of experience in test automation, CI/CD, and software quality.
                        Uniquely combines deep SDET expertise with hands-on full-stack development — having built and launched
                        production applications end-to-end using Go, TypeScript/React, React Native, and PostgreSQL,
                        including a live iOS app on the App Store.
                    </p>
                </div>

                {/* skills */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                        <h2 className="text-white font-bold text-xl">technical skills</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(SKILLS).map(([cat, items]) => (
                            <div key={cat} className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
                                <div className="text-[#5bbf8a]/60 font-mono text-xs mb-3 uppercase tracking-widest">{cat}</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {items.map(item => (
                                        <span key={item} className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/50 text-xs font-mono">
                      {item}
                    </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* experience */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                        <h2 className="text-white font-bold text-xl">experience</h2>
                    </div>
                    <div className="relative">
                        <div className="absolute left-0 top-2 bottom-2 w-px bg-white/[0.06]" />
                        <div className="space-y-8">
                            {EXPERIENCE.map((e, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full border ${
                                        e.now ? 'bg-[#5bbf8a] border-[#5bbf8a]' : 'bg-[#161b22] border-white/20'
                                    }`} />
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-white/20 font-mono text-xs">{e.period}</span>
                                        {e.now && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5bbf8a]/10 border border-[#5bbf8a]/30 text-[#5bbf8a] font-mono">NOW</span>
                                        )}
                                    </div>
                                    <div className="text-white font-semibold text-sm mb-0.5">{e.role}</div>
                                    <div className="text-[#5bbf8a]/60 text-xs font-mono mb-3">{e.company}</div>
                                    <ul className="space-y-1.5">
                                        {e.bullets.map((b, j) => (
                                            <li key={j} className="flex items-start gap-2">
                                                <span className="text-[#5bbf8a]/40 mt-1 flex-shrink-0">→</span>
                                                <span className="text-white/40 text-sm leading-relaxed">{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* education */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-[#5bbf8a] font-mono text-sm">#</span>
                        <h2 className="text-white font-bold text-xl">education</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-5">
                            <div className="text-white/70 font-semibold mb-1">Northwestern University</div>
                            <div className="text-white/40 text-sm">MS, Biomedical Engineering</div>
                            <div className="text-white/20 font-mono text-xs mt-2">2013 — 2015 · GPA 3.5</div>
                        </div>
                        <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-5">
                            <div className="text-white/70 font-semibold mb-1">Yeditepe University</div>
                            <div className="text-white/40 text-sm">BS, Biomedical Engineering</div>
                            <div className="text-white/20 font-mono text-xs mt-2">2007 — 2011 · GPA 3.6</div>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}