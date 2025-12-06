import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { hashPassword } from '../../../../lib/auth';

export async function GET(req, { params }) {
    try {
        const id = params.id;
        const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(id);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        return NextResponse.json({ user });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const id = params.id;
        const body = await req.json();
        const { name, email, role, password } = body; // password optional

        // Update basic info
        db.prepare('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?').run(name, email, role, id);

        // Update password if provided
        if (password && password.trim() !== '') {
            const pwHash = await hashPassword(password);
            db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(pwHash, id);
        }

        const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(id);
        return NextResponse.json({ user });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const id = params.id;
        const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);
        return NextResponse.json({ success: info.changes > 0 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
