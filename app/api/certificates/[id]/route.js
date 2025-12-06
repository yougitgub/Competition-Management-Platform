import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import fs from 'fs';
import path from 'path';

export async function GET(req, { params }) {
  try {
    const id = params.id;
    const cert = db.prepare('SELECT * FROM certificates WHERE id = ?').get(id);
    if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    // Return certificate record and file URL
    return NextResponse.json({ certificate: cert });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
