
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function check() {
    const users = await prisma.user.count()
    const products = await prisma.product.count()
    const orders = await prisma.order.count()
    const orderItems = await prisma.orderItem.count()

    console.log(`Users: ${users}`)
    console.log(`Products: ${products}`)
    console.log(`Orders: ${orders}`)
    console.log(`OrderItems: ${orderItems}`)
}

check()
    .finally(async () => {
        await prisma.$disconnect()
    })
