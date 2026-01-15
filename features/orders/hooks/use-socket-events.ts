'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSocket } from '@/components/providers/socket-provider'

export function useSocketEvents() {
    const { socket, isConnected } = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket || !isConnected) return

        socket.on('order:updated', (data: { id: string, status: string }) => {
            console.log('Real-time order update received:', data)
            // Invalidate the specific order query
            queryClient.invalidateQueries({ queryKey: ['order', data.id] })
            // Invalidate the orders list
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        })

        socket.on('order:created', (data) => {
            console.log('Real-time new order received:', data)
            // Invalidate the orders list and dashboard stats
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['stats'] })
        })

        return () => {
            socket.off('order:updated')
            socket.off('order:created')
        }
    }, [socket, isConnected, queryClient])
}
