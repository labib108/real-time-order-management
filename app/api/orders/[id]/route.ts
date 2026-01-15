import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const order = await db.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                // statusHistory: {
                //     orderBy: {
                //         createdAt: 'desc'
                //     }
                // }
            }
        })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error('Order API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
    }
}
