import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '../../../lib/db';
import { getUserFromSession } from '../../../lib/auth';

export async function GET() {
  try {
    const comps = db.prepare('SELECT * FROM competitions ORDER BY start_date DESC').all();
    return NextResponse.json({ competitions: comps });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const user = token ? getUserFromSession(token) : null;

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, rules, start_date, end_date, max_participants } = body;
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    const stmt = db.prepare('INSERT INTO competitions (title,description,rules,start_date,end_date,max_participants) VALUES (?,?,?,?,?,?)');
    const info = stmt.run(title, description || null, rules || null, start_date || null, end_date || null, max_participants || null);
    const comp = db.prepare('SELECT * FROM competitions WHERE id = ?').get(info.lastInsertRowid);
    return NextResponse.json({ competition: comp }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
