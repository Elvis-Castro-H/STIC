import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { Product } from '@/app/types/Products'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const response = await axios.get<Product>(`${BASE_URL}/api/Product/${params.id}`)
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const body = await request.json()
    const response = await axios.put(`${BASE_URL}/api/Product/${params.id}`, body)
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await axios.delete(`${BASE_URL}/api/Product/${params.id}`)
    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
