// src/components/portfolio/AskSafa.tsx

import {useEffect, useRef, useState} from "react";
import {apiClient} from "@/lib/apiClient.ts";

type Message = {
    role: 'user' | "assistant"
    content: string
}

const SUGGESTIONS = [
    "What's your tech stack?",
    "Tell me about DeployWatch",
    "Are you open to work?",
    "What's your background?",
]

export function AskSafa() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: 'Hey! Ask me anything about Safa — his work, stack, experience, or availability.'
            }])
        }
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [open])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const send = async (text?: string) => {
        const message = text ?? input.trim()
        if (!message || loading) return

        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: message }])
        setLoading(true)

        const res = await apiClient.post<{ reply: string }>('/api/ai/chat', { message })

        if (res.ok) {
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }])
        } else {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Something went wrong. Try again in a moment.'
            }])
        }
        setLoading(false)
    }

    return (
        <>
            {/* overlay — mobile only */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* chat panel */}
            {open && (
                <div className="fixed bottom-20 right-4 md:right-6 z-50
                        w-[calc(100vw-2rem)] md:w-[420px]
                        bg-[#161b22] border border-white/[0.08] rounded-xl
                        shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
                     style={{ height: '480px' }}>

                    {/* title bar */}
                    <div className="flex items-center justify-between px-4 py-3
                          border-b border-white/[0.06] bg-[#0d1117]/60 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            </div>
                            <span className="text-white/40 font-mono text-xs">ask-safa ~</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5bbf8a] animate-pulse" />
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white/20 hover:text-white/60 transition-colors font-mono text-sm"
                        >
                            ✕
                        </button>
                    </div>

                    {/* messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <span className="text-[#5bbf8a] font-mono text-xs mt-1 flex-shrink-0">$</span>
                                )}
                                <div className={`max-w-[85%] text-sm leading-relaxed rounded-lg px-3 py-2 font-mono ${
                                    msg.role === 'user'
                                        ? 'bg-[#5bbf8a]/20 border border-[#5bbf8a]/30 text-white/80 text-right'
                                        : 'bg-[#0d1117] border border-white/[0.06] text-white/70'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-2 justify-start">
                                <span className="text-[#5bbf8a] font-mono text-xs mt-1">$</span>
                                <div className="bg-[#0d1117] border border-white/[0.06] rounded-lg px-3 py-2">
                                    <span className="text-[#5bbf8a] font-mono text-sm animate-pulse">thinking_</span>
                                </div>
                            </div>
                        )}

                        {/* suggestions — show only on first message */}
                        {messages.length === 1 && !loading && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {SUGGESTIONS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => send(s)}
                                        className="text-xs font-mono px-3 py-1.5 rounded-lg
                               border border-white/[0.08] text-white/40
                               hover:border-[#5bbf8a]/40 hover:text-white/70
                               transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* input */}
                    <div className="flex-shrink-0 border-t border-white/[0.06] p-3 bg-[#0d1117]/40">
                        <div className="flex items-center gap-2 bg-[#0d1117] border border-white/[0.08]
                            rounded-lg px-3 py-2 focus-within:border-[#5bbf8a]/40 transition-colors">
                            <span className="text-[#5bbf8a] font-mono text-xs flex-shrink-0">~$</span>
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && send()}
                                placeholder="ask anything about Safa..."
                                maxLength={500}
                                className="flex-1 bg-transparent text-white/70 font-mono text-sm
                           placeholder-white/20 outline-none"
                            />
                            <button
                                onClick={() => send()}
                                disabled={!input.trim() || loading}
                                className="text-[#5bbf8a]/60 hover:text-[#5bbf8a] disabled:opacity-30
                           transition-colors font-mono text-sm flex-shrink-0"
                            >
                                ↵
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* floating button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-4 right-4 md:right-6 z-50
                   w-12 h-12 rounded-full
                   bg-[#5bbf8a] hover:bg-[#5bbf8a]/90
                   text-[#0d1117] font-bold text-lg
                   shadow-lg shadow-[#5bbf8a]/20
                   transition-all hover:scale-105
                   flex items-center justify-center"
                aria-label="Ask Safa AI"
            >
                {open ? '✕' : 'AI'}
            </button>
        </>
    )
}
