import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const url = new URL(req.url);
    const role = url.searchParams.get('role');

    let query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .sort({ name: 1 })
      .select('name email role'); // Only select needed fields

    const formattedUsers = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing name, email or password' }, { status: 400 });
    }

    if (!['admin', 'student'].includes(role || 'student')) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();

    // Check if exists
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: emailLower,
      password: hashedPassword,
      role: role || 'student'
    });

    return NextResponse.json({
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }, { status: 201 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
