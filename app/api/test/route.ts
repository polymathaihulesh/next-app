
import { NextResponse } from 'next/server';


// Helper to add timeout to a promise
function withTimeout(promise: Promise<Response>, ms: number, timeoutMsg = 'Request timed out'): Promise<Response> {
  return Promise.race([
    promise,
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error(timeoutMsg)), ms)),
  ]);
}


export async function GET(request: Request) {
  const responsePromise = new Promise<Response>((resolve) => {
    setTimeout(() => {
      resolve(NextResponse.json({ message: 'Test API GET route working!' }));
    }, 1000);
  });

  return withTimeout(responsePromise, 10000);
}


export async function POST(request: Request) {
  const data = await request.json();
  // Delay response for 1 minute (60000 ms)
  await new Promise((resolve) => setTimeout(resolve, 60000));
  return NextResponse.json({ message: 'Test API POST route working! (delayed 1 min)', received: data });
}
