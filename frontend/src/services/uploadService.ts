import { BASE_URL } from '@/lib/config'

export const uploadService = {
    upload: async (file: File): Promise<string | null> => {
        const form = new FormData()
        form.append('image', file)
        const res = await fetch(`${BASE_URL}/api/admin/upload`, {
            method: 'POST',
            credentials: 'include',
            body: form,
        })
        if (!res.ok) return null
        const json = await res.json()
        return json?.data?.url ?? null
    },
}