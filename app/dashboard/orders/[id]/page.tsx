'use client'

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { ordersApi } from "@/features/orders/api/orders"
import { OrderDetails } from "@/features/orders/components/order-details"
import { Loader2 } from "lucide-react"

export default function OrderDetailsPage() {
    const params = useParams()
    const id = params.id as string

    const { data: order, isLoading, isError } = useQuery({
        queryKey: ['order', id],
        queryFn: () => ordersApi.getOrderById(id),
        enabled: !!id,
    })

    if (isLoading) {
        return (
            <div className="flex h-[600px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (isError || !order) {
        return (
            <div className="flex h-[400px] items-center justify-center text-center">
                <div>
                    <h3 className="text-lg font-semibold">Error</h3>
                    <p className="text-muted-foreground">Failed to load order details. Please try again later.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <OrderDetails order={order} />
        </div>
    )
}
