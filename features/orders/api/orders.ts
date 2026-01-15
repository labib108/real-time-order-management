import { apiClient } from '@/lib/api-client'
import { Order, OrderFilter, OrdersResponse } from '../types'

export const ordersApi = {
    getOrders: async (params?: OrderFilter): Promise<OrdersResponse> => {
        const { data } = await apiClient.get<OrdersResponse>('/orders', { params })
        return data
    },
    getOrderById: async (id: string): Promise<Order> => {
        const { data } = await apiClient.get<Order>(`/orders/${id}`)
        return data
    },
}
