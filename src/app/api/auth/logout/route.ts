import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ status: 'ok' });
  const secure = process.env.NODE_ENV === 'production';
  try {
    // clear cookie via cookies API
    res.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      secure: secure,
    });
  } catch (err) {
    // fallback header
    res.headers.set('Set-Cookie', `token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`);
  }
  return res;
}

export async function GET() {
  // support GET for convenience in browser testing
  return POST();
}
