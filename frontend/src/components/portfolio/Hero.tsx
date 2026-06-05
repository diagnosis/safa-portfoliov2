import { useEffect, useState } from 'react'

const LINES = [
    { prompt: true, cmd: 'whoami' },
    { out: '<span class="text-[#5bbf8a]">safa demirkan</span> — based in the Pacific Northwest' },
    { prompt: true, cmd: 'cat role.txt' },
    { out: 'Automation-Driven <span class="text-[#5bbf8a]">Software Engineer</span>' },
    { prompt: true, cmd: 'ls ~/focus' },
    { out: '<span class="text-[#5bbf8a]">backend/</span>   <span class="text-[#5bbf8a]">full-stack/</span>   shipped-products/' },
    { prompt: true, cmd: 'echo $MISSION' },
    { out: '9 yrs in test automation → building <span class="text-white">real products</span>, end to end.' },
]

export function Hero() {
    const [lineIdx, setLineIdx] = useState(0)
    const [charIdx, setCharIdx] = useState(0)
    const [done, setDone] = useState<number[]>([])
    const [finished, setFinished] = useState(false)

    useEffect(() => {
        if (lineIdx >= LINES.length) { setFinished(true); return }
        const line = LINES[lineIdx]
        if (!line.prompt) {
            const t = setTimeout(() => {
                setDone(d => [...d, lineIdx])
                setLineIdx(n => n + 1)
                setCharIdx(0)
            }, 420)
            return () => clearTimeout(t)
        }
        if (charIdx < line.cmd!.length) {
            const t = setTimeout(() => setCharIdx(c => c + 1), 38 + Math.random() * 30)
            return () => clearTimeout(t)
        }
        const t = setTimeout(() => {
            setDone(d => [...d, lineIdx])
            setLineIdx(n => n + 1)
            setCharIdx(0)
        }, 480)
        return () => clearTimeout(t)
    }, [lineIdx, charIdx])

    return (
        <header className="min-h-screen flex items-center pt-14 relative overflow-hidden" id="top">
            {/* background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(91,191,138,0.06),transparent_60%)]" />

            {/* ridgelines */}
            <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 360" preserveAspectRatio="none">
                <path d="M0,210 L150,150 L300,196 L470,120 L640,182 L820,108 L1010,176 L1200,128 L1440,184 L1440,360 L0,360 Z" fill="rgba(91,191,138,0.04)" />
                <path d="M0,260 L180,196 L360,250 L540,168 L720,238 L900,158 L1100,242 L1290,182 L1440,246 L1440,360 L0,360 Z" fill="rgba(91,191,138,0.06)" />
                <path d="M0,320 L160,268 L320,312 L520,250 L700,308 L880,246 L1080,310 L1280,262 L1440,306 L1440,360 L0,360 Z" fill="rgba(13,17,23,0.9)" />
                <path d="M0,320 L160,268 L320,312 L520,250 L700,308 L880,246 L1080,310 L1280,262 L1440,306" fill="none" stroke="#5bbf8a" strokeWidth="1.2" strokeOpacity="0.25" />
            </svg>

            <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-2 gap-16 items-center relative z-10">
                {/* left */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#5bbf8a] animate-pulse" />
                        <span className="text-[#5bbf8a]/70 text-sm font-mono">available for senior & staff-level roles</span>
                    </div>
                    <h1 className="text-6xl font-bold tracking-tight mb-6 leading-none">
                        Safa <span className="text-[#5bbf8a]">Demirkan</span>
                    </h1>
                    <p className="text-white/50 text-lg leading-relaxed mb-8">
                        Automation-driven <strong className="text-white">software engineer</strong> in the Pacific Northwest.
                        Nine years sharpening systems as an SDET — now shipping{' '}
                        <span className="text-[#5bbf8a]">full-stack products</span> with Go and React.
                    </p>
                    <div className="flex gap-3">
                        <a href="#projects" className="px-6 py-3 rounded-lg bg-[#5bbf8a] text-[#0d1117] font-semibold text-sm hover:bg-[#5bbf8a]/90 transition-colors">
                            view work ↗
                        </a>
                        <a href="#contact" className="px-6 py-3 rounded-lg border border-white/10 text-white/70 text-sm hover:border-white/20 hover:text-white transition-colors">
                            get in touch
                        </a>
                    </div>
                </div>

                {/* terminal */}
                <div className="bg-[#161b22] border border-white/[0.08] rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0d1117]/50">
                        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        <span className="text-white/30 text-xs font-mono ml-2">safa — zsh — ~/intro</span>
                    </div>
                    <div className="p-5 font-mono text-sm space-y-1.5 min-h-[280px]">
                        {LINES.map((line, i) => {
                            if (!done.includes(i) && i !== lineIdx) return null
                            const isTyping = i === lineIdx && !done.includes(i)
                            if (line.prompt) {
                                const shown = isTyping ? line.cmd!.slice(0, charIdx) : line.cmd
                                return (
                                    <div key={i}>
                                        <span className="text-[#5bbf8a]">safa@pnw</span>
                                        <span className="text-white/30">:~$ </span>
                                        <span className="text-white">{shown}</span>
                                        {isTyping && <span className="inline-block w-2 h-4 bg-[#5bbf8a] animate-pulse ml-0.5" />}
                                    </div>
                                )
                            }
                            return (
                                <div key={i} className="text-white/60 pl-0"
                                     dangerouslySetInnerHTML={{ __html: line.out! }} />
                            )
                        })}
                        {finished && (
                            <div>
                                <span className="text-[#5bbf8a]">safa@pnw</span>
                                <span className="text-white/30">:~$ </span>
                                <span className="inline-block w-2 h-4 bg-[#5bbf8a] animate-pulse ml-0.5" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}