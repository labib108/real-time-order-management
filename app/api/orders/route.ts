import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const page = Number(searchParams.get('page')) || 1
        const limit = Number(searchParams.get('limit')) || 10
        const search = searchParams.get('search') || ''
        const status = searchParams.get('status') || 'all'
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')
        const sortBy = searchParams.get('sortBy') || 'createdAt'
        const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'

        const skip = (page - 1) * limit

        const where: Prisma.OrderWhereInput = {}

        if (search) {
            where.OR = [
                { id: { contains: search } },
                { customerName: { contains: search } },
            ]
        }

        if (status !== 'all') {
            where.status = status
        }

        if (startDate || endDate) {
            where.createdAt = {}
            if (startDate) {
                where.createdAt.gte = new Date(startDate)
            }
            if (endDate) {
                // Set to end of day
                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                where.createdAt.lte = end
            }
        }

        const [orders, total] = await Promise.all([
            db.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    items: {
                        include: { product: true }
                    }
                }
            }),
            db.order.count({ where }),
        ])

        return NextResponse.json({
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Orders API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}
