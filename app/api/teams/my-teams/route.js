import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Team from '@/models/Team';
import { auth } from '@/auth';

export async function GET(req) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Get teams where user is leader
        const teams = await Team.find({ leader: session.user.id })
            .populate('members', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ teams });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
