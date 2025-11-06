import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import users from '@/lib/users';

function getTokenFromRequest(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  if (match) return match[1];
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.substring(7);
  return null;
}

export async function GET(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 });
    const payload = verifyJwt(token);
    if (!payload) return NextResponse.json({ status: 'error', message: 'Invalid or expired token' }, { status: 401 });
    const user = users.find(u => u.id === payload.sub);
    if (!user) return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    return NextResponse.json({ status: 'ok', user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (e: any) {
    return NextResponse.json({ status: 'error', message: e?.message || 'Unknown' }, { status: 500 });
  }
}
