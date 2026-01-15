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
    updateStatus: async (id: string, status: string, notes?: string): Promise<Order> => {
        const { data } = await apiClient.patch<Order>(`/orders/${id}`, { status, notes })
        return data
    },
    save: async (order: any): Promise<Order> => {
        const { data } = await apiClient.post<Order>('/orders', order)
        return data
    }
}
