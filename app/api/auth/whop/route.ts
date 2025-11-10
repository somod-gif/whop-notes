// /app/api/auth/whop/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  const token = req.headers.get('Authorization'); // "Bearer <WHOP_TOKEN>"

  if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

  try {
    const res = await axios.get('https://api.whop.com/v1/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = res.data;

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
