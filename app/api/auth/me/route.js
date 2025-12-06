import { NextResponse } from 'next/server';
import { getUserFromSession } from '../../../../lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
        return NextResponse.json({ user: null });
    }

    const user = getUserFromSession(sessionToken);

    // Don't return sensitive data like password hash
    if (user) {
        const { password_hash, ...safeUser } = user;
        return NextResponse.json({ user: safeUser });
    }

    return NextResponse.json({ user: null });
}
