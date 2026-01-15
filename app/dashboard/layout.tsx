'use client'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

import { SocketProvider } from '@/components/providers/socket-provider'
import { useSocketEvents } from '@/features/orders/hooks/use-socket-events'

function RealTimeHandler() {
    useSocketEvents()
    return null
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
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
        <SocketProvider>
            <RealTimeHandler />
            <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] h-screen overflow-hidden">
                <Sidebar className="hidden lg:flex" />
                <div className="flex flex-col h-full overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50/50 dark:bg-gray-950">
                        {children}
                    </main>
                </div>
            </div>
        </SocketProvider>
    )
}
