import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Registration from '@/models/Registration';
import Competition from '@/models/Competition';
import Team from '@/models/Team';
import { auth } from '@/auth';

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const url = new URL(req.url);
    const competition_id = url.searchParams.get('competition_id');

    if (session.user.role === 'admin') {
      const query = competition_id ? { competition: competition_id } : {};
      const regs = await Registration.find(query)
        .populate('user', 'name email')
        .populate('competition', 'title')
        .populate('team', 'name')
        .sort({ createdAt: -1 });
      return NextResponse.json({ registrations: regs });
    } else {
      const regs = await Registration.find({ user: session.user.id })
        .populate('competition', 'title startDate endDate')
        .populate('team', 'name')
        .sort({ createdAt: -1 });
      return NextResponse.json({ registrations: regs });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { competition_id, team_id } = body; // student_id comes from session

    if (!competition_id) return NextResponse.json({ error: 'Missing competition_id' }, { status: 400 });

    await dbConnect();

    // Check competition
    const comp = await Competition.findById(competition_id);
    if (!comp) return NextResponse.json({ error: 'Competition not found' }, { status: 404 });

    const now = new Date();
    if (comp.end_date && new Date(comp.endDate) < now) {
      return NextResponse.json({ error: 'Registration closed' }, { status: 400 });
    }

    // Check Type
    if (comp.type === 'team') {
      if (!team_id) return NextResponse.json({ error: 'Team ID required for team competition' }, { status: 400 });

      const team = await Team.findById(team_id);
      if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });

      // Verify leader
      if (team.leader.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Only team leader can register the team' }, { status: 403 });
      }

      // Check if team already registered
      const existing = await Registration.findOne({ team: team_id, competition: competition_id });
      if (existing) return NextResponse.json({ error: 'Team already registered' }, { status: 409 });

      const reg = await Registration.create({
        user: session.user.id, // Registered by leader
        competition: competition_id,
        team: team_id,
        status: 'pending' // Maybe auto-approve?
      });
      return NextResponse.json({ registration: reg }, { status: 201 });

    } else {
      // Individual
      const existing = await Registration.findOne({ user: session.user.id, competition: competition_id });
      if (existing) return NextResponse.json({ error: 'Already registered' }, { status: 409 });

      const reg = await Registration.create({
        user: session.user.id,
        competition: competition_id,
        status: 'pending'
      });
      return NextResponse.json({ registration: reg }, { status: 201 });
    }

  } catch (err) {
    console.error(err);
    if (err.code === 11000) return NextResponse.json({ error: 'Already registered' }, { status: 409 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await dbConnect();

    // Check permission
    const reg = await Registration.findById(id);
    if (!reg) return NextResponse.json({ error: 'Registration not found' }, { status: 404 });

    if (session.user.role !== 'admin' && reg.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Registration.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

