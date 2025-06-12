import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

//const BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/quotation" || '';
const BASE_URL = 'https://stic-quotation.onrender.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await axios.post(`${BASE_URL}/api/quotation/Spacer/calculate-price`, body);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error('Error calculating quotation:', error.message || error);
    return NextResponse.json({ error: 'Failed to calculate quotation' }, { status: 500 });
  }
}
