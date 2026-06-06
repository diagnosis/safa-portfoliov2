import { useLogout } from '@/hooks/authHooks'
import { Link, useRouterState } from '@tanstack/react-router'

const NAV_ITEMS = [
    { to: '/admin/dashboard', label: 'dashboard' },
    { to: '/admin/projects', label: 'projects' },
    { to: '/admin/blog', label: 'blog' },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const logout = useLogout()
    const { location } = useRouterState()

    return (
        <div className="min-h-screen bg-[#0d1117] flex">

            {/* sidebar */}
            <aside className="w-52 border-r border-white/[0.06] flex flex-col flex-shrink-0">
                <div className="px-4 py-4 border-b border-white/[0.06]">
                    <div className="font-mono text-sm text-white/60">safa@pnw</div>
                    <div className="font-mono text-xs text-white/20">admin panel</div>
                </div>

                <nav className="flex-1 py-3">
                    {NAV_ITEMS.map(item => {
                        const active = location.pathname === item.to
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-mono transition-colors ${
                                    active
                                        ? 'text-[#5bbf8a] border-r-2 border-[#5bbf8a] bg-[#5bbf8a]/[0.05]'
                                        : 'text-white/30 hover:text-white/60'
                                }`}
                            >
                                <span className={active ? 'text-[#5bbf8a]' : 'text-white/20'}>#</span>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="px-4 py-4 border-t border-white/[0.06]">
                    <button
                        onClick={() => logout.mutate()}
                        className="text-white/20 hover:text-red-400/60 text-xs font-mono transition-colors"
                    >
                        logout →
                    </button>
                </div>
            </aside>

            {/* main */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}