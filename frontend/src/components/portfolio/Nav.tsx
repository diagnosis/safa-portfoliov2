export function Nav() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0d1117]/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                <a href="#top" className="font-mono text-sm">
                    <span className="text-white">safa</span>
                    <span className="text-white/40">@</span>
                    <span className="text-white">pnw</span>
                    <span className="text-white/40">:~$</span>
                    <span className="text-[#5bbf8a] animate-pulse ml-1">_</span>
                </a>
                <div className="flex items-center gap-6">
                    {['projects', 'stack', 'experience'].map(h => (
                        <a key={h} href={`#${h}`} className="text-white/40 hover:text-white text-sm transition-colors">
                            <span className="text-[#5bbf8a]">#</span>{h}
                        </a>
                    ))}
                    <a href="#contact" className="px-4 py-1.5 rounded-lg border border-[#5bbf8a]/40 text-[#5bbf8a] text-sm hover:bg-[#5bbf8a]/10 transition-colors">
                        contact ↗
                    </a>
                </div>
            </div>
        </nav>
    )
}