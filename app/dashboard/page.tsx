'use client'

import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "@/features/dashboard/api/dashboard"
import { StatsGrid } from "@/features/dashboard/components/stats-grid"
import { RevenueChart } from "@/features/dashboard/components/revenue-chart"
import { RecentSales } from "@/features/dashboard/components/recent-sales"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: dashboardApi.getStats,
    })

    if (isLoading) {
        return <DashboardSkeleton />
    }

    if (error || !stats) {
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load dashboard stats. Please try again later.
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <StatsGrid stats={stats} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RevenueChart />
                <RecentSales />
            </div>
        </div>
    )
}

function DashboardSkeleton() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-8 w-[150px]" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-[125px] rounded-xl" />
                <Skeleton className="h-[125px] rounded-xl" />
                <Skeleton className="h-[125px] rounded-xl" />
                <Skeleton className="h-[125px] rounded-xl" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-[350px] rounded-xl" />
                <Skeleton className="col-span-3 h-[350px] rounded-xl" />
            </div>
        </div>
    )
}

