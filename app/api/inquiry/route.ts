import { NextResponse } from 'next/server';
import { inquirySchema } from '@/lib/inquiry-schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = inquirySchema.parse(body);

    // Optional: integrate Resend or CRM webhook here
    console.info('[inquiry]', data.email, data.projectCountry, data.projectAreaSqm);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[inquiry] validation failed', error);
    return NextResponse.json({ error: 'Invalid inquiry' }, { status: 400 });
  }
}
