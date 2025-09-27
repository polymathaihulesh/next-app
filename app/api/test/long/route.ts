import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Delay response for 5 minutes (300000 ms)
  await new Promise((resolve) => setTimeout(resolve, 240000));
  return NextResponse.json({ message: 'Test API GET route working! (delayed 5 min)' });
}