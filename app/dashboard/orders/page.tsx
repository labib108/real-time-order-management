'use client'

import { useState } from "react"
import { useOrders } from "@/features/orders/hooks/use-orders"
import { OrdersTable } from "@/features/orders/components/orders-table"
import { OrderFilters } from "@/features/orders/components/order-filters"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react"
import { CreateOrderForm } from "@/features/orders/components/create-order-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function OrdersPage() {
    const {
        orders,
        meta,
        isLoading,
        filters,
        updateFilters,
        nextPage,
        prevPage
    } = useOrders()

    const [open, setOpen] = useState(false)

    const handleSort = (field: 'createdAt' | 'total') => {
        const order = filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc'
        updateFilters({ sortBy: field, sortOrder: order })
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground"> Manage and monitor your real-time orders.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Order
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Order</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to create a new order.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateOrderForm onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <OrderFilters
                search={filters.search}
                status={filters.status}
                startDate={filters.startDate}
                endDate={filters.endDate}
                onSearchChange={(search) => updateFilters({ search })}
                onStatusChange={(status) => updateFilters({ status })}
                onDateChange={(startDate, endDate) => updateFilters({ startDate, endDate })}
                onReset={() => updateFilters({ search: '', status: 'all', startDate: undefined, endDate: undefined })}
            />

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex h-[400px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <OrdersTable
                            orders={orders}
                            sortBy={filters.sortBy}
                            sortOrder={filters.sortOrder}
                            onSort={handleSort}
                        />

                        {meta && (
                            <div className="flex items-center justify-between px-2">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> to <span className="font-medium">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={prevPage}
                                        disabled={meta.page <= 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <div className="text-sm font-medium">
                                        Page {meta.page} of {meta.totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={nextPage}
                                        disabled={meta.page >= meta.totalPages}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
