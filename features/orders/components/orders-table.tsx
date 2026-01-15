import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Order } from "../types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type OrdersTableProps = {
    orders: Order[]
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    onSort: (field: 'createdAt' | 'total') => void
}

const statusVariants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
    delivered: "default",
    cancelled: "destructive",
    pending: "secondary",
    processing: "outline",
}

export function OrdersTable({ orders, sortBy, sortOrder, onSort }: OrdersTableProps) {
    if (!orders || orders.length === 0) {
        return (
            <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">No orders found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                onClick={() => onSort('total')}
                                className="-ml-4 h-8 gap-1 hover:bg-transparent"
                            >
                                Total
                                <ArrowUpDown className="h-3 w-3" />
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">
                            <Button
                                variant="ghost"
                                onClick={() => onSort('createdAt')}
                                className="-mr-4 h-8 gap-1 float-right hover:bg-transparent"
                            >
                                Date
                                <ArrowUpDown className="h-3 w-3" />
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow
                            key={order.id}
                            className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                        >
                            <TableCell className="font-mono text-xs text-muted-foreground">
                                <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                </Link>
                            </TableCell>
                            <TableCell className="font-medium">
                                <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                                    {order.customerName}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Badge variant={statusVariants[order.status] || 'secondary'} className="capitalize">
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                                ${Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                                {format(new Date(order.createdAt), "MMM d, h:mm a")}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
