import { NextResponse } from 'next/server';
import { whopClient } from '@/app/backend/lib/whopClients';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.redirect('http://localhost:3000/login');

  try {
    // Exchange code for token
    const tokenResponse = await whopClient.oauth.exchangeCodeForToken({
      code,
      redirectUri: process.env.NEXT_PUBLIC_WHOP_REDIRECT_URI!,
      clientId: process.env.NEXT_PUBLIC_WHOP_CLIENT_ID!,
    });

    const accessToken = tokenResponse.access_token;

    // Set cookie
    const res = NextResponse.redirect('http://localhost:3000/dashboard');
    res.cookies.set('whop_session', accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error('OAuth error:', err);
    return NextResponse.redirect('http://localhost:3000/login');
  }
}
