import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PulleyQuotationRequest, PulleyQuotationResponse } from '@/app/types/Pulleys';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL + "/quotation" || '';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PulleyQuotationRequest;

    const response = await axios.post<PulleyQuotationResponse>(
      `${BACKEND_URL}/api/quotation/Pulley/calculate-price`,
      body
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error('Error calculating pulley quotation:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to calculate pulley quotation' },
      { status: 500 }
    );
  }
}
