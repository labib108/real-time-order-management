'use client'

import { Order } from "../types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Package, Truck, User, CreditCard, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type OrderDetailsProps = {
    order: Order
}

const statusVariants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
    delivered: "default",
    cancelled: "destructive",
    pending: "secondary",
    processing: "outline",
}

export function OrderDetails({ order }: OrderDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/orders">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(0, 8).toUpperCase()}</h2>
                        <p className="text-sm text-muted-foreground">
                            Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                    </div>
                </div>
                <Badge variant={statusVariants[order.status] || 'secondary'} className="text-sm px-3 py-1 capitalize">
                    {order.status}
                </Badge>
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
                                    <div className="text-sm text-muted-foreground">No history available.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
