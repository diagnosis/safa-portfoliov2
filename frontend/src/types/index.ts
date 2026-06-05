export interface Project {
    id: string
    title: string
    slug: string
    description?: string
    body?: string
    tech_stack: string[]
    platforms: string[]
    live_url?: string
    repo_url?: string
    app_store_url?: string
    play_store_url?: string
    image_url?: string
    featured: boolean
    published: boolean
    created_at: string
    updated_at: string
}

export interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt?: string
    body?: string
    published: boolean
    created_at: string
    updated_at: string
}