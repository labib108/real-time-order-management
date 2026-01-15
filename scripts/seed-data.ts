
import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seeding...')

    // 1. Create Users
    console.log('Creating users...')
    const hashedPassword = await bcrypt.hash('password123', 10)

    // Create Admin if not exists
    const adminEmail = 'admin@example.com'
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            role: 'admin',
            password_hash: hashedPassword,
        },
    })

    // Create 5 random customers
    for (let i = 0; i < 5; i++) {
        await prisma.user.upsert({
            where: { email: `user${i}@example.com` },
            update: {},
            create: {
                email: `user${i}@example.com`,
                role: 'user',
                password_hash: hashedPassword,
            },
        })
    }

    // 2. Create Products
    console.log('Creating products...')
    const products = []
    for (let i = 0; i < 20; i++) {
        const product = await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price({ min: 10, max: 200 })),
                stock: faker.number.int({ min: 0, max: 100 }),
                image: '/placeholder.png',
            },
        })
        products.push(product)
    }

    // 3. Create Orders (Past 30 Days)
    console.log('Creating 120 orders...')
    const statuses = ['pending', 'processing', 'delivered', 'cancelled']
    const today = new Date()

    for (let i = 0; i < 120; i++) {
        const customerName = faker.person.fullName()
        // Random date within last 30 days
        const orderDate = faker.date.recent({ days: 30 })

        // Force some orders to be "today" for real-time validation
        if (i > 110) {
            orderDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate())
        }

        const status = faker.helpers.arrayElement(statuses)

        // Create random order items
        const orderItemsData = []
        let orderTotal = 0

        const numItems = faker.number.int({ min: 1, max: 5 })
        for (let j = 0; j < numItems; j++) {
            const product = faker.helpers.arrayElement(products)
            const quantity = faker.number.int({ min: 1, max: 3 })
            const price = Number(product.price)

            orderTotal += price * quantity
            orderItemsData.push({
                productId: product.id,
                quantity: quantity,
                price: product.price,
            })
        }

        await prisma.order.create({
            data: {
                customerName,
                status,
                total: orderTotal,
                createdAt: orderDate,
                items: {
                    create: orderItemsData,
                },
            },
        })
    }

    console.log('✅ Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
