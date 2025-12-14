import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import { auth } from '@/auth'; // Use auth() instead of manual token parsing if possible, or keep manual if auth() is server-only and not available here (Route Handlers support auth())
// Actually, Route Handlers can use auth(). Let's use auth() for consistency.

export async function GET(req) {
  try {
    await dbConnect();
    const session = await auth();

    // Note: auth() might return null if not authenticated.
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = session.user;

    const url = new URL(req.url);
    const competition_id = url.searchParams.get('competition_id');
    const q = url.searchParams.get('q');

    if (user.role === 'admin') {
      let query = {};
      if (competition_id) {
        query.competition = competition_id;
      }

      let results = await Result.find(query)
        .populate('user', 'name email')
        .populate('competition', 'title startDate') // For competition_title
        .sort({ position: 1 });

      if (q) {
        const qLower = q.toLowerCase();
        results = results.filter(r => r.user?.name.toLowerCase().includes(qLower));
      }

      // Format for frontend consistency
      results = results.map(r => ({
        ...r.toObject(),
        id: r._id.toString(),
        name: r.user?.name || 'Unknown',
        email: r.user?.email || 'N/A',
        competition_title: r.competition?.title || 'Competition'
      }));

      return NextResponse.json({ results });
    } else {
      // Student view
      // Find results for this student
      const results = await Result.find({ user: user.id })
        .populate('competition', 'title startDate')
        .sort({ 'competition.startDate': -1 });

      const formatted = results.map(r => ({
        ...r.toObject(),
        id: r._id.toString(),
        competition_title: r.competition?.title || 'Competition'
      }));

      return NextResponse.json({ results: formatted });
    }
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
    const { competition_id, student_id, position, score } = body;

    if (!competition_id || !student_id) {
      return NextResponse.json({ error: 'Missing competition_id or student_id' }, { status: 400 });
    }

    const newResult = await Result.create({
      competition: competition_id,
      user: student_id,
      position: Number(position),
      score: Number(score),
      published: false // Default to false
    });

    const populated = await newResult.populate('user', 'name email');

    const resultObj = {
      ...populated.toObject(),
      id: populated._id.toString(),
      name: populated.user?.name,
      email: populated.user?.email
    };

    return NextResponse.json({ result: resultObj }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
