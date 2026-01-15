import { apiClient } from '@/lib/api-client'
import { DashboardStats } from '../types'

export const dashboardApi = {
    getStats: async (): Promise<DashboardStats> => {
        const { data } = await apiClient.get<DashboardStats>('/dashboard/stats')
        return data
    },
}
