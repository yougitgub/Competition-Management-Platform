import { getCompetitions } from '@/actions/competition-actions';
import { getCompetitionsStats } from '@/actions/result-actions';
import { auth } from '@/auth';
import ResultsView from './results-view';

export default async function ResultsIndexPage() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'admin';

    let competitions = [];
    let stats = [];

    if (isAdmin) {
        // Admin sees all competitions and stats
        stats = await getCompetitionsStats();
        // Use stats as the source of competitions because it has everything + counts
        competitions = stats;
    } else {
        // Student sees only competitions that have published results (or just all completed ones?)
        // The requirement implies tabs appear when results are published.
        // Let's filter fetching competitions that are 'completed' or have results.
        const allComps = await getCompetitions();

        // We might want to filter by "isPublished" but that property is dynamic in stats.
        // For efficiency, we can just use getCompetitionsStats internally or filter here.
        // But `getCompetitions` is light.
        // Let's perform a filter on the client or fetch only relevant ones.
        // For now, allow viewing all completed/active.
        competitions = allComps.filter(c => c.status !== 'upcoming');
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-2">Competition Results</h1>
            <p className="text-slate-400 mb-8">View and manage latest competition standings.</p>

            <ResultsView competitions={competitions} isAdmin={isAdmin} stats={stats} />
        </div>
    )
}
