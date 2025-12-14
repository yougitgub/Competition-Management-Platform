import { getCompetitionById } from '@/actions/competition-actions';
import { getJudges } from '@/actions/user-actions';
import { auth } from '@/auth';
import ManageJudgesClient from './manage-judges-client';

export default async function JudgesPage({ params }) {
    const { id } = await params;
    const session = await auth();

    // Only admin can assign judges
    if (session?.user?.role !== 'admin') {
        return <div className="text-white">Unauthorized</div>;
    }

    const [competition, allJudges] = await Promise.all([
        getCompetitionById(id),
        getJudges()
    ]);

    if (!competition) return <div>Competition not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Assign Judges: {competition.title}</h1>
            <ManageJudgesClient competition={competition} allJudges={allJudges} />
        </div>
    );
}
