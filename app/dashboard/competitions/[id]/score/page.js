import { auth } from '@/auth';
import ScoringClient from '../../results/[id]/scoring-client';

export default async function ScoringPage({ params }) {
    const { id } = await params;
    const session = await auth();

    // Check if user is admin or judge
    // ScoringClient can handle admin view (scoring)
    // We want to force admin view for judges too
    const isJudgeOrAdmin = session?.user?.role === 'admin' || session?.user?.role === 'judge';

    if (!isJudgeOrAdmin) {
        return <div className="text-white text-center mt-10">Unauthorized. Only judges and admins can access this page.</div>;
    }

    // Reuse the same client component as admin results
    // We pass isAdmin=true to force the scoring interface mode
    return <ScoringClient id={id} isAdmin={true} />;
}
