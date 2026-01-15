import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
    try {
        const totalOrders = await db.order.count()
        const pendingOrders = await db.order.count({ where: { status: 'pending' } })
        const completedOrders = await db.order.count({ where: { status: 'delivered' } })

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const revenueAgg = await db.order.aggregate({
            _sum: {
                total: true,
            },
        })
        const totalRevenue = revenueAgg._sum.total || 0

        const todaysRevenueAgg = await db.order.aggregate({
            where: {
                createdAt: {
                    gte: today,
                },
            },
            _sum: {
                total: true,
            },
        })
        const todaysRevenue = todaysRevenueAgg._sum.total || 0

        return NextResponse.json({
            totalOrders,
            pendingOrders,
            completedOrders,
            totalRevenue,
            todaysRevenue,
        })
    } catch (error) {
        console.error('Dashboard Stats Error:', error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
