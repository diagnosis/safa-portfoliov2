import { apiClient } from '@/lib/apiClient'
import type { BlogPost } from '@/types'

export const blogService = {
    list: () =>
        apiClient.get<{ posts: BlogPost[]; count: number }>('/api/blog'),
    get: (slug: string) =>
        apiClient.get<{ post: BlogPost }>(`/api/blog/${slug}`),
    adminList: () =>
        apiClient.get<{ posts: BlogPost[]; count: number }>('/api/admin/blog'),
    create: (data: Partial<BlogPost>) =>
        apiClient.post<{ post: BlogPost }>('/api/admin/blog', data),
    update: (id: string, data: Partial<BlogPost>) =>
        apiClient.patch<{ post: BlogPost }>(`/api/admin/blog/${id}`, data),
    delete: (id: string) =>
        apiClient.del(`/api/admin/blog/${id}`),
}