import { Link, useRouterState } from '@tanstack/react-router'
import {useEffect, useRef, useState} from 'react'

export function Nav() {
    const { location } = useRouterState()
    const isHome = location.pathname === '/'
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: Event) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('touchstart', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [menuOpen])

    return (
        <nav ref={menuRef} className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0d1117]/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                <a href="/" className="font-mono text-sm">
                    <span className="text-white">safa</span>
                    <span className="text-white/40">@</span>
                    <span className="text-white">pnw</span>
                    <span className="text-white/40">:~$</span>
                    <span className="text-[#5bbf8a] animate-pulse ml-1">_</span>
                </a>

                {/* desktop links */}
                <div className="hidden md:flex items-center gap-6">
                    {isHome ? (
                        <>
                            {['projects', 'stack', 'experience'].map(h => (
                                <a key={h} href={`#${h}`}
                                   className="text-white/40 hover:text-white text-sm transition-colors">
                                    <span className="text-[#5bbf8a]">#</span>{h}
                                </a>
                            ))}
                        </>
                    ) : (
                        <Link to="/" className="text-white/40 hover:text-white text-sm transition-colors">
                            <span className="text-[#5bbf8a]">#</span>home
                        </Link>
                    )}
                    <Link to="/blog" className="text-white/40 hover:text-white text-sm transition-colors">
                        <span className="text-[#5bbf8a]">#</span>blog
                    </Link>
                    <Link to="/resume" className="text-white/40 hover:text-white text-sm transition-colors">
                        <span className="text-[#5bbf8a]">#</span>resume
                    </Link>
                    <a href={isHome ? '#contact' : '/#contact'}
                       className="px-4 py-1.5 rounded-lg border border-[#5bbf8a]/40 text-[#5bbf8a] text-sm hover:bg-[#5bbf8a]/10 transition-colors">
                        contact ↗
                    </a>
                </div>

                {/* hamburger */}
                <button
                    onClick={() => setMenuOpen(o => !o)}
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    aria-label="menu"
                >
                    <span className={`block w-5 h-px bg-white/60 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-5 h-px bg-white/60 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-5 h-px bg-white/60 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-white/[0.06] bg-[#0d1117]/95 backdrop-blur-sm">
                    <div className="px-6 py-4 flex flex-col gap-4">
                        {isHome && ['projects', 'stack', 'experience'].map(h => (
                            <a key={h} href={`#${h}`}
                               onClick={() => setMenuOpen(false)}
                               className="text-white/40 hover:text-white text-sm transition-colors">
                                <span className="text-[#5bbf8a]">#</span>{h}
                            </a>
                        ))}
                        {!isHome && (
                            <Link to="/" onClick={() => setMenuOpen(false)}
                                  className="text-white/40 hover:text-white text-sm transition-colors">
                                <span className="text-[#5bbf8a]">#</span>home
                            </Link>
                        )}
                        <Link to="/blog" onClick={() => setMenuOpen(false)}
                              className="text-white/40 hover:text-white text-sm transition-colors">
                            <span className="text-[#5bbf8a]">#</span>blog
                        </Link>
                        <Link to="/resume" onClick={() => setMenuOpen(false)}
                              className="text-white/40 hover:text-white text-sm transition-colors">
                            <span className="text-[#5bbf8a]">#</span>resume
                        </Link>
                        <a href={isHome ? '#contact' : '/#contact'}
                           onClick={() => setMenuOpen(false)}
                           className="px-4 py-2 rounded-lg border border-[#5bbf8a]/40 text-[#5bbf8a] text-sm hover:bg-[#5bbf8a]/10 transition-colors w-fit">
                            contact ↗
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}