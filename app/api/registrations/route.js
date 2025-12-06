import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '../../../lib/db';
import { getUserFromSession } from '../../../lib/auth';

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const user = token ? getUserFromSession(token) : null;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const competition_id = url.searchParams.get('competition_id');

    // If admin, show all (or filtered by comp). If student, show only theirs.
    if (user.role === 'admin') {
      if (competition_id) {
        const regs = db.prepare('SELECT r.*, u.name, u.email FROM registrations r JOIN users u ON u.id = r.student_id WHERE r.competition_id = ? ORDER BY r.created_at DESC').all(competition_id);
        return NextResponse.json({ registrations: regs });
      }
      const regs = db.prepare('SELECT r.*, u.name, u.email, c.title as competition_title FROM registrations r JOIN users u ON u.id = r.student_id JOIN competitions c ON c.id = r.competition_id ORDER BY r.created_at DESC').all();
      return NextResponse.json({ registrations: regs });
    } else {
      // Student view
      const regs = db.prepare('SELECT r.*, c.title as competition_title, c.start_date, c.end_date FROM registrations r JOIN competitions c ON c.id = r.competition_id WHERE r.student_id = ? ORDER BY r.created_at DESC').all(user.id);
      return NextResponse.json({ registrations: regs });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { student_id, competition_id } = body;
    if (!student_id || !competition_id) return NextResponse.json({ error: 'Missing student_id or competition_id' }, { status: 400 });
    // Check duplicate
    const exists = db.prepare('SELECT * FROM registrations WHERE student_id = ? AND competition_id = ?').get(student_id, competition_id);
    if (exists) return NextResponse.json({ error: 'Already registered' }, { status: 409 });
    // Check competition dates
    const comp = db.prepare('SELECT * FROM competitions WHERE id = ?').get(competition_id);
    if (!comp) return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
    const now = new Date();
    if (comp.end_date && new Date(comp.end_date) < now) return NextResponse.json({ error: 'Registration closed' }, { status: 400 });
    const stmt = db.prepare('INSERT INTO registrations (student_id, competition_id) VALUES (?,?)');
    const info = stmt.run(student_id, competition_id);
    const reg = db.prepare('SELECT r.*, u.name, u.email FROM registrations r JOIN users u ON u.id = r.student_id WHERE r.id = ?').get(info.lastInsertRowid);
    return NextResponse.json({ registration: reg }, { status: 201 });
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT_UNIQUE') return NextResponse.json({ error: 'Already registered' }, { status: 409 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
// ... POST method ...

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // In a real app, check permission (Admin or the student themselves)
    // For now, assuming Admin access based on UI context/simple requirement

    const stmt = db.prepare('DELETE FROM registrations WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
