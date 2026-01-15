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

import { emitSocketEvent } from '@/lib/socket-utils'

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { status, notes } = await req.json()

        // Create transaction to update status
        const updatedOrder = await db.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: { id },
                data: { status }
            })

            // Temporarily disabled status history due to Prisma client sync issues
            /*
            await tx.orderStatusHistory.create({
                data: {
                    orderId: id,
                    status,
                    notes: notes || `Order status updated to ${status}`
                }
            })
            */

            return order
        })

        // Emit socket event for real-time update
        emitSocketEvent('order:update', { id, status })

        return NextResponse.json(updatedOrder)
    } catch (error) {
        console.error('Order Patch Error:', error)
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }
}
