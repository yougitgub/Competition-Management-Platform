import { auth } from '@/auth';
import ScoringClient from '../../../results/[id]/scoring-client';

export default async function ScoringPage({ params }) {
    const { id } = await params;
    const session = await auth();

    // Check if user is admin
    // ScoringClient can handle admin view (scoring)
    const isAdmin = session?.user?.role === 'admin';

    if (!isAdmin) {
        return <div className="text-white text-center mt-10">Unauthorized. Only admins can access this page.</div>;
    }

    // Reuse the same client component as admin results
    // We pass isAdmin=true to force the scoring interface mode
    return <ScoringClient id={id} isAdmin={true} />;
}
