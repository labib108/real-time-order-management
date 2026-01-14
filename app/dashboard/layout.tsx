'use client'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login')
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (!user) {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            {/* Sidebar/Nav placeholder */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <button
                        onClick={logout}
                        className="text-sm font-medium text-red-600 hover:text-red-500"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="p-8">
                {children}
            </main>
        </div>
    )
}
