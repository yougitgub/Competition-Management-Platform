import { NextResponse } from 'next/server';
import { deleteSession } from '../../../../lib/db.js';
import { destroySessionCookie } from '../../../../lib/auth.js';

export async function POST(req) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.match(/session=([^;]+)/);
    if (match) {
      const token = match[1];
      deleteSession(token);
      const clear = destroySessionCookie(token);
      const res = NextResponse.json({ ok: true });
      res.headers.set('Set-Cookie', clear);
      return res;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
