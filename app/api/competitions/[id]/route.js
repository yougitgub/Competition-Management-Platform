import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(req, { params }) {
  try {
    const id = params.id;
    const comp = db.prepare('SELECT * FROM competitions WHERE id = ?').get(id);
    if (!comp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ competition: comp });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { title, description, rules, start_date, end_date, max_participants } = body;
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    const stmt = db.prepare('UPDATE competitions SET title=?,description=?,rules=?,start_date=?,end_date=?,max_participants=? WHERE id=?');
    stmt.run(title, description || null, rules || null, start_date || null, end_date || null, max_participants || null, id);
    const comp = db.prepare('SELECT * FROM competitions WHERE id = ?').get(id);
    return NextResponse.json({ competition: comp });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    const stmt = db.prepare('DELETE FROM competitions WHERE id = ?');
    const info = stmt.run(id);
    return NextResponse.json({ ok: info.changes > 0 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
