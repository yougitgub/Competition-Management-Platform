import { auth } from '@/auth';
import { getCompetitionById } from '@/actions/competition-actions';
import { updateUserRole } from '@/actions/user-actions'; // Add if needed or remove
import ClientEndCompetition from './client-end-competition';

export default async function EndCompetitionButton({ competitionId, status }) {
    const session = await auth();
    // Only admin can end
    if (session?.user?.role !== 'admin') return null;

    if (status === 'completed') {
        return (
            <div className="w-full bg-slate-500/20 text-slate-400 text-center py-2 rounded-lg text-sm font-semibold cursor-default">
                Competition Ended
            </div>
        );
    }

    return <ClientEndCompetition competitionId={competitionId} />;
}
