import { apiClient } from '@/lib/apiClient'
import type { Project } from '@/types'

export const projectService = {
    list: () =>
        apiClient.get<{ projects: Project[]; count: number }>('/api/projects'),
    get: (slug: string) =>
        apiClient.get<{ project: Project }>(`/api/projects/${slug}`),
    adminList: () =>
        apiClient.get<{ projects: Project[]; count: number }>('/api/admin/projects'),
    create: (data: Partial<Project>) =>
        apiClient.post<{ project: Project }>('/api/admin/projects', data),
    update: (id: string, data: Partial<Project>) =>
        apiClient.patch<{ project: Project }>(`/api/admin/projects/${id}`, data),
    delete: (id: string) =>
        apiClient.del(`/api/admin/projects/${id}`),
}