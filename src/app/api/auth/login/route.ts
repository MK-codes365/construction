import { NextResponse } from 'next/server';
import users from '@/lib/users';
import { signJwt } from '@/lib/jwt';
import sha256 from 'crypto-js/sha256';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ status: 'error', message: 'Missing credentials' }, { status: 400 });
    }

    const user = users.find(u => u.email === email || u.username === email);
    if (!user) return NextResponse.json({ status: 'error', message: 'Invalid credentials' }, { status: 401 });

    const hash = sha256(password).toString();
    if (hash !== user.passwordHash) return NextResponse.json({ status: 'error', message: 'Invalid credentials' }, { status: 401 });

    const token = signJwt({ sub: user.id, email: user.email, role: user.role, name: user.name }, 60 * 60);

    const res = NextResponse.json({ status: 'ok', user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    // set httpOnly cookie
    const secure = process.env.NODE_ENV === 'production';
    res.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60*60}; SameSite=Lax${secure ? '; Secure' : ''}`);
    return res;
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e?.message || 'Unknown error' }, { status: 500 });
  }
}
