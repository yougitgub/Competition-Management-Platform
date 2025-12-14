import { auth } from '@/auth';
import ScoringClient from './scoring-client';

export default async function Page({ params }) {
    const { id } = await params;
    const session = await auth();
    const isAdmin = session?.user?.role === 'admin';

    return <ScoringClient id={id} isAdmin={isAdmin} />;
}
