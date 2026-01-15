'use client'

import { Order, OrderStatus } from "../types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Package, Truck, User, ChevronLeft, AlertCircle, Ban, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ordersApi } from "../api/orders"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type OrderDetailsProps = {
    order: Order
}

const statusVariants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
    delivered: "default",
    cancelled: "destructive",
    pending: "secondary",
    processing: "outline",
    shipped: "outline",
}

const nextStatuses: Record<string, OrderStatus[]> = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
}

export function OrderDetails({ order }: OrderDetailsProps) {
    const queryClient = useQueryClient()

    const { mutate: updateStatus, isPending } = useMutation({
        mutationFn: ({ status, notes }: { status: string, notes?: string }) =>
            ordersApi.updateStatus(order.id, status, notes),
        onMutate: async (newStatus) => {
            await queryClient.cancelQueries({ queryKey: ['order', order.id] })
            const previousOrder = queryClient.getQueryData(['order', order.id])

            queryClient.setQueryData(['order', order.id], (old: any) => ({
                ...old,
                status: newStatus.status
            }))

            return { previousOrder }
        },
        onError: (err, newStatus, context) => {
            queryClient.setQueryData(['order', order.id], context?.previousOrder)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['order', order.id] })
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        }
    })

    const handleStatusUpdate = (status: OrderStatus) => {
        updateStatus({ status })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/orders">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(0, 8).toUpperCase()}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={statusVariants[order.status] || 'secondary'} className="capitalize">
                                {order.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                • Placed {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" disabled={isPending}>
                                        Update Status
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Change Status To</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {nextStatuses[order.status].map((status) => (
                                        <DropdownMenuItem
                                            key={status}
                                            onClick={() => handleStatusUpdate(status)}
                                            className="capitalize"
                                        >
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {order.status === 'pending' && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleStatusUpdate('cancelled')}
                                    disabled={isPending}
                                >
                                    <Ban className="mr-2 h-4 w-4" />
                                    Cancel Order
                                </Button>
                            )}
                        </>
                    )}
                    {order.status === 'delivered' && (
                        <div className="flex items-center text-green-600 text-sm font-medium gap-1 px-3">
                            <CheckCircle2 className="h-4 w-4" />
                            Completed
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="font-medium">{item.product.name}</div>
                                        </TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Separator className="my-4" />
                        <div className="space-y-1.5 text-right">
                            <div className="flex justify-end gap-10 text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="w-20 font-medium">${Number(order.total).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-end gap-10 text-sm">
                                <span className="text-muted-foreground">Tax (0%)</span>
                                <span className="w-20 font-medium">$0.00</span>
                            </div>
                            <div className="flex justify-end gap-10 text-lg font-bold">
                                <span>Total</span>
                                <span className="w-20">${Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium">Name</div>
                                <div className="text-sm text-muted-foreground">{order.customerName}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Email</div>
                                <div className="text-sm text-muted-foreground">{order.customerName.toLowerCase().replace(/ /g, '.')}@example.com</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Shipping Address</div>
                                <div className="text-sm text-muted-foreground">123 Business Rd, City, Country</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Status History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.statusHistory && order.statusHistory.length > 0 ? (
                                    order.statusHistory.map((history, idx) => (
                                        <div key={history.id} className="flex gap-3 relative pb-4 last:pb-0">
                                            {idx !== order.statusHistory!.length - 1 && (
                                                <div className="absolute left-[9px] top-6 bottom-0 w-[2px] bg-muted" />
                                            )}
                                            <div className="mt-1.5 h-[20px] w-[20px] rounded-full border-2 border-primary bg-background flex items-center justify-center shrink-0 z-10">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium capitalize">{history.status}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {format(new Date(history.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                                </div>
                                                {history.notes && (
                                                    <div className="text-xs mt-1 italic text-muted-foreground">{history.notes}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground flex flex-col items-center gap-2 py-4">
                                        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                                        <span>No history available.</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

