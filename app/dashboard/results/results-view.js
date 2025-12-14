'use client';

import { useState } from 'react';
import { publishResults } from '@/actions/result-actions';
import { Button } from '@/components/ui/button';
import { Trophy, Share, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import ResultsManager from './manage/results-manager';

export default function ResultsView({ competitions, isAdmin, stats }) {
    const [activeTab, setActiveTab] = useState(competitions.length > 0 ? competitions[0]._id : null);
    const [resultsMap, setResultsMap] = useState({}); // To store fetched results if we were fetching them client-side, but might be simpler to just fetch all initially or use Server Actions.
    // For simplicity, we are assuming 'competitions' prop might contain results or we fetch them on tab switch?
    // Actually, fetching specific results on tab click is better for performance. But for clean code now, we can perhaps just link to the details, OR embed the table.
    // The user asked to "make a new tab... to show all results".
    // Let's implement fetching results for the active tab.

    // Actually, reusing the logic from ScoringClient (ResultsTable) is best.

    return (
        <div className="w-full space-y-6">
            {isAdmin && (
                <div className="mb-8 p-6 glass-panel border border-blue-500/20 bg-blue-900/10 rounded-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Admin Controls</h2>
                    <ResultsManager initialData={stats} />
                </div>
            )}

            <div className="bg-slate-900/50 p-1 rounded-lg inline-flex flex-wrap gap-1">
                {competitions.map(comp => (
                    <button
                        key={comp._id}
                        onClick={() => setActiveTab(comp._id)}
                        className={clsx(
                            "px-4 py-2 text-sm font-medium rounded-md transition-all",
                            activeTab === comp._id
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {comp.title}
                    </button>
                ))}
                {competitions.length === 0 && <span className="text-slate-500 px-3 py-2 text-sm">No competitions with results found.</span>}
            </div>

            <div className="glass-panel p-6 min-h-[300px]">
                {activeTab ? (
                    <ResultsTabContent competitionId={activeTab} isAdmin={isAdmin} />
                ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                        Select a competition/tab to view results.
                    </div>
                )}
            </div>
        </div>
    );
}

import { getResults, getCompetitionById } from '@/actions/result-actions';
import { useEffect } from 'react';

function ResultsTabContent({ competitionId, isAdmin }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!competitionId) return;
        setLoading(true);
        // We need to fetch specific results for this competition.
        // We can reuse the action `getResults`
        getResults(competitionId).then(data => {
            setResults(data);
            setLoading(false);
        });
    }, [competitionId]);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

    if (results.length === 0) return <div className="text-center p-8 text-slate-400">No results found for this competition.</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-bold text-white">Ranking Board</h3>
                <span className="text-sm text-slate-400">{results.length} Participants</span>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-300 text-sm uppercase">
                        <tr>
                            <th className="p-4">Rank</th>
                            <th className="p-4">Participant</th>
                            <th className="p-4 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {results.map((r) => (
                            <tr key={r._id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 flex items-center gap-2">
                                    {r.position === 1 && <Trophy className="w-5 h-5 text-yellow-400" />}
                                    {r.position === 2 && <Trophy className="w-5 h-5 text-gray-400" />}
                                    {r.position === 3 && <Trophy className="w-5 h-5 text-amber-600" />}
                                    <span className={clsx(
                                        "font-mono font-bold",
                                        r.position <= 3 ? "text-white text-lg" : "text-slate-400"
                                    )}>
                                        {r.position}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-white">
                                    <div className="flex flex-col">
                                        <span>{r.team ? r.team.name : r.user?.name}</span>
                                        <span className="text-xs text-slate-500 font-normal">{r.user?.email}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <span className="font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                                        {r.score}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
