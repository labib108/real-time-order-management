import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
    try {
        const products = await db.product.findMany({
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(products)
    } catch (error) {
        console.error('Products API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}
