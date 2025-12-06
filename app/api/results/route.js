import { NextResponse } from 'next/server';
import db from '../../../lib/db';

import { cookies } from 'next/headers';
import { getUserFromSession } from '../../../lib/auth';

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const user = token ? getUserFromSession(token) : null;

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const competition_id = url.searchParams.get('competition_id');
    const q = url.searchParams.get('q');

    if (user.role === 'admin') {
      if (competition_id) {
        if (q) {
          const rows = db.prepare("SELECT r.*, u.name, u.email FROM results r JOIN users u ON u.id = r.student_id WHERE r.competition_id = ? AND u.name LIKE ? ORDER BY r.position ASC").all(competition_id, `%${q}%`);
          return NextResponse.json({ results: rows });
        }
        const rows = db.prepare('SELECT r.*, u.name, u.email FROM results r JOIN users u ON u.id = r.student_id WHERE r.competition_id = ? ORDER BY r.position ASC').all(competition_id);
        return NextResponse.json({ results: rows });
      }
      const rows = db.prepare('SELECT r.*, u.name, u.email, c.title as competition_title FROM results r JOIN users u ON u.id = r.student_id JOIN competitions c ON c.id = r.competition_id ORDER BY c.start_date DESC, r.position ASC').all();
      return NextResponse.json({ results: rows });
    } else {
      // Student view
      const rows = db.prepare('SELECT r.*, c.title as competition_title FROM results r JOIN competitions c ON c.id = r.competition_id WHERE r.student_id = ? ORDER BY c.start_date DESC').all(user.id);
      return NextResponse.json({ results: rows });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { competition_id, student_id, position, score } = body;
    if (!competition_id || !student_id) return NextResponse.json({ error: 'Missing competition_id or student_id' }, { status: 400 });
    const stmt = db.prepare('INSERT INTO results (competition_id, student_id, position, score) VALUES (?,?,?,?)');
    const info = stmt.run(competition_id, student_id, position || null, score || null);
    const resRecord = db.prepare('SELECT r.*, u.name, u.email FROM results r JOIN users u ON u.id = r.student_id WHERE r.id = ?').get(info.lastInsertRowid);
    return NextResponse.json({ result: resRecord }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
