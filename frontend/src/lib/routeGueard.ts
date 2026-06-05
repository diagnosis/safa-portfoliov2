import type { QueryClient } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"
import { meQueryOptions } from "@/hooks/authHooks"

export async function requireAuth(queryClient: QueryClient) {
    try {
        await queryClient.ensureQueryData(meQueryOptions())
    } catch {
        throw redirect({ to: '/admin/login' })
    }
}

export async function requireGuest(queryClient: QueryClient) {
    try {
        await queryClient.ensureQueryData(meQueryOptions())
        throw redirect({ to: '/admin/dashboard' })
    } catch (e) {
        if (e instanceof Error) return
        throw e
    }
}