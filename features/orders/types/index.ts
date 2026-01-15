export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type OrderItem = {
    id: string
    quantity: number
    price: number
    product: {
        name: string
        image: string | null
    }
}

export type OrderStatusHistory = {
    id: string
    status: OrderStatus
    notes: string | null
    createdAt: string
}

export type Order = {
    id: string
    customerName: string
    status: OrderStatus
    total: number
    createdAt: string
    items?: OrderItem[]
    statusHistory?: OrderStatusHistory[]
}

export type OrdersResponse = {
    data: Order[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export type OrderFilter = {
    page?: number
    limit?: number
    search?: string
    status?: string
    startDate?: string
    endDate?: string
    sortBy?: 'createdAt' | 'total'
    sortOrder?: 'asc' | 'desc'
}
