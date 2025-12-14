import { auth } from '@/auth';
import { getCompetitionsStats } from '@/actions/result-actions';
import { redirect } from 'next/navigation';
import ResultsManager from './results-manager';

export default async function ManageResultsPage() {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        redirect('/dashboard');
    }

    const competitions = await getCompetitionsStats();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Results Center</h1>
                <p className="text-slate-400">Manage and publish results for all competitions from one place.</p>
            </div>

            <ResultsManager initialData={competitions} />
        </div>
    );
}
