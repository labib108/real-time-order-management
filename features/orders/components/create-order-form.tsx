'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createOrderSchema, CreateOrderInput } from '../types/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { ordersApi } from '../api/orders'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type Product = {
    id: string
    name: string
    price: string
}

export function CreateOrderForm({ onSuccess }: { onSuccess: () => void }) {
    const queryClient = useQueryClient()
    const [products, setProducts] = useState<Product[]>([])
    const [loadingProducts, setLoadingProducts] = useState(true)

    const form = useForm<CreateOrderInput>({
        resolver: zodResolver(createOrderSchema),
        defaultValues: {
            customerName: '',
            items: [{ productId: '', quantity: 1, price: 0 }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    })

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data)
                setLoadingProducts(false)
            })
            .catch((err) => {
                console.error('Failed to load products:', err)
                setLoadingProducts(false)
            })
    }, [])

    const { mutate: createOrder, isPending } = useMutation({
        mutationFn: (data: CreateOrderInput) => ordersApi.save(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['stats'] })
            onSuccess()
        },
    })

    const onSubmit = (data: CreateOrderInput) => {
        createOrder(data)
    }

    const handleProductChange = (index: number, productId: string) => {
        const product = products.find((p) => p.id === productId)
        if (product) {
            form.setValue(`items.${index}.price`, Number(product.price))
        }
    }

    const items = form.watch('items')
    const total = items ? items.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Customer Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter customer name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Order Items</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ productId: '', quantity: 1, price: 0 })}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 gap-3 items-end border p-3 rounded-lg bg-muted/30">
                                <div className="col-span-6">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.productId`}
                                        render={({ field: productField }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Product</FormLabel>
                                                <Select
                                                    onValueChange={(val) => {
                                                        productField.onChange(val)
                                                        handleProductChange(index, val)
                                                    }}
                                                    defaultValue={productField.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select product" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {loadingProducts ? (
                                                            <div className="flex items-center justify-center p-2">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            </div>
                                                        ) : (
                                                            products.map((p) => (
                                                                <SelectItem key={p.id} value={p.id}>
                                                                    {p.name} (${Number(p.price).toFixed(2)})
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field: qtyField }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Qty</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...qtyField}
                                                        onChange={(e) => qtyField.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Subtotal</Label>
                                        <div className="h-10 flex items-center px-3 rounded-md border bg-muted text-sm font-medium">
                                            ${((form.watch(`items.${index}.price`) || 0) * (form.watch(`items.${index}.quantity`) || 0)).toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive h-10 w-10 hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => fields.length > 1 && remove(index)}
                                        disabled={fields.length <= 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm font-medium">
                        Total Amount: <span className="text-lg font-bold ml-1">${total.toFixed(2)}</span>
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Order
                    </Button>
                </div>
            </form>
        </Form>
    )
}
