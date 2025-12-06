import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { generateCertificate } from '../../../../lib/pdf';

export async function POST(req) {
  try {
    const body = await req.json();
    const { result_id } = body;
    if (!result_id) return NextResponse.json({ error: 'Missing result_id' }, { status: 400 });
    const result = db.prepare('SELECT r.*, u.name as student_name, c.title as competition_title FROM results r JOIN users u ON u.id = r.student_id JOIN competitions c ON c.id = r.competition_id WHERE r.id = ?').get(result_id);
    if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    const pdfUrl = await generateCertificate({ studentName: result.student_name, competitionName: result.competition_title, rank: result.position || 'N/A', date: new Date().toISOString().slice(0,10) });
    const stmt = db.prepare('INSERT INTO certificates (result_id,pdf_url) VALUES (?,?)');
    const info = stmt.run(result_id, pdfUrl);
    const cert = db.prepare('SELECT * FROM certificates WHERE id = ?').get(info.lastInsertRowid);
    return NextResponse.json({ certificate: cert }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
