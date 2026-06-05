import {apiClient} from "./apiClient.ts";

export async function authBootstrap(): Promise<boolean> {
    const res = await apiClient.get<{ admin: boolean }>('/api/admin/me')
    return res.ok && res.data.admin === true
}