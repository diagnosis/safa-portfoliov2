import { apiClient } from "@/lib/apiClient.ts";

export const authService = {
    login: (email: string) =>
        apiClient.post('/api/admin/login', { email }),
    verify: (email: string, code: string) =>
        apiClient.post('/api/admin/verify', { email, code }),
    logout: () =>
        apiClient.post('/api/admin/logout'),
    me: () =>
        apiClient.get<{ admin: boolean }>('/api/admin/me'),
}



