import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your_api_key_here')) {
      console.error('[Security] Attempted to use missing or placeholder API key.');
      return NextResponse.json({ 
        error: 'Configuration Error', 
        details: 'API key is not configured on the server. Please check environment variables.' 
      }, { status: 500 });
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.status === 429) {
      console.error('Gemini API Quota Exceeded (429)');
      return NextResponse.json({ 
        error: 'Rate limit exceeded. Please wait a moment and try again.',
        details: data.error?.message 
      }, { status: 429 });
    }
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
