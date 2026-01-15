import { z } from 'zod'

export const orderItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
    price: z.number().positive('Price must be positive'),
})

export const createOrderSchema = z.object({
    customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
    items: z.array(orderItemSchema).min(1, 'At least one item is required'),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
