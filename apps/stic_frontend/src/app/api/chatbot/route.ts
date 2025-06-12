import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

//const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const BASE_URL = 'https://3a39-2a09-bac1-1040-10-00-c1-1d.ngrok-free.app';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await axios.post(`${BASE_URL}/webhooks/rest/webhook`, body);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error('Error sending message to chatbot:', error.message || error);
    return NextResponse.json({ error: 'Failed to contact chatbot' }, { status: 500 });
  }
}
