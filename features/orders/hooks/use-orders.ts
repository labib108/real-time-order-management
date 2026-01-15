'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import { ordersApi } from '../api/orders'
import { OrderFilter } from '../types'
import { useDebounce } from '@/hooks/use-debounce'

export function useOrders(initialFilters: OrderFilter = { page: 1, limit: 10, status: 'all' }) {
    const [filters, setFilters] = useState<OrderFilter>(initialFilters)
    const debouncedSearch = useDebounce(filters.search, 500)

    const queryParams = {
        ...filters,
        search: debouncedSearch,
    }

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['orders', queryParams],
        queryFn: () => ordersApi.getOrders(queryParams),
    })

    const updateFilters = useCallback((newFilters: Partial<OrderFilter>) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: newFilters.page ?? 1, // Reset to page 1 on filter change unless page is specified
        }))
    }, [])

    const nextPage = useCallback(() => {
        if (data && filters.page! < data.meta.totalPages) {
            updateFilters({ page: filters.page! + 1 })
        }
    }, [data, filters.page, updateFilters])

    const prevPage = useCallback(() => {
        if (filters.page! > 1) {
            updateFilters({ page: filters.page! - 1 })
        }
    }, [filters.page, updateFilters])

    return {
        orders: data?.data || [],
        meta: data?.meta,
        isLoading,
        isError,
        filters,
        updateFilters,
        nextPage,
        prevPage,
        refetch,
    }
}
