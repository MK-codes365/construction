import { NextResponse } from 'next/server';
// lightweight id generation to avoid requiring @types/uuid in the demo
import sha256 from 'crypto-js/sha256';
import { signJwt } from '@/lib/jwt';
import { findUserByEmailOrUsername, addUser } from '@/lib/users';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password, name, role } = body || {};
    if (!email || !password || !username) {
      return NextResponse.json({ status: 'error', message: 'Missing required fields' }, { status: 400 });
    }

    // basic checks
    const existing = findUserByEmailOrUsername(email) || findUserByEmailOrUsername(username);
    if (existing) return NextResponse.json({ status: 'error', message: 'User already exists' }, { status: 409 });

    if (password.length < 6) return NextResponse.json({ status: 'error', message: 'Password too short' }, { status: 400 });

  const id = `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
    const pwdHash = sha256(password).toString();
    const newUser = {
      id,
      username,
      email,
      passwordHash: pwdHash,
      role: role || 'worker',
      name: name || username,
    };

    addUser(newUser as any);

    // sign token
    const token = signJwt({ sub: id, email, role: newUser.role, name: newUser.name }, 60 * 60);
    const res = NextResponse.json({ status: 'ok', user: { id, email, role: newUser.role, name: newUser.name } });
    // use NextResponse cookies API so cookies are set correctly in edge/Node runtimes
    const secure = process.env.NODE_ENV === 'production';
    try {
      res.cookies.set('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60,
        sameSite: 'lax',
        secure: secure,
      });
    } catch (err) {
      // Fallback to header set if cookies API is not available in the runtime
      res.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60}; SameSite=Lax${secure ? '; Secure' : ''}`);
    }

    return res;
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e?.message || 'Unknown error' }, { status: 500 });
  }
}
