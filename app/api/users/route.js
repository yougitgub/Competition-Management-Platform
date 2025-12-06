import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '../../../lib/db';
import { hashPassword, getUserFromSession } from '../../../lib/auth';

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  const user = getUserFromSession(token);
  return (user && user.role === 'admin') ? user : null;
}

export async function GET(req) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    if (role) {
      const rows = db.prepare('SELECT id,name,email,role FROM users WHERE role = ? ORDER BY name ASC').all(role);
      return NextResponse.json({ users: rows });
    }
    const rows = db.prepare('SELECT id,name,email,role FROM users ORDER BY name ASC').all();
    return NextResponse.json({ users: rows });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, email, password, role } = body;
    if (!name || !email || !password) return NextResponse.json({ error: 'Missing name, email or password' }, { status: 400 });
    if (!['admin', 'teacher', 'student'].includes(role || 'student')) return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    const emailLower = email.toLowerCase();
    const exists = db.prepare('SELECT * FROM users WHERE email = ?').get(emailLower);
    if (exists) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    const pwHash = await hashPassword(password);
    const stmt = db.prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)');
    const info = stmt.run(name, emailLower, pwHash, role || 'student');
    const user = db.prepare('SELECT id,name,email,role FROM users WHERE id = ?').get(info.lastInsertRowid);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
