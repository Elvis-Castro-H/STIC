import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { Product } from '@/app/types/Products'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

/**
 * GET: Get product by ID
 */
export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    const response = await axios.get<Product>(`${BASE_URL}/api/Product/${id}`)
    return NextResponse.json(response.data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
}

/**
 * PUT: Update product by ID
 */
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    const body = await req.json()
    const response = await axios.put<Product>(`${BASE_URL}/api/Product/${id}`, body)
    return NextResponse.json(response.data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

/**
 * DELETE: Delete product by ID
 */
export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    await axios.delete(`${BASE_URL}/api/Product/${id}`)
    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
