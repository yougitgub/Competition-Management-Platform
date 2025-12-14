'use client';

import { getParticipantsForScoring, getResults, submitScore, publishResults } from '@/actions/result-actions';
import { getCompetitionById } from '@/actions/competition-actions';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Save, Loader2, Share } from 'lucide-react';

export default function ScoringClient({ id, isAdmin }) {
    const [competition, setCompetition] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [existingResults, setExistingResults] = useState([]);
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);
    const [activeTab, setActiveTab] = useState('scoring');

    useEffect(() => {
        loadData();
    }, [id, isAdmin]);

    async function loadData() {
        if (isAdmin) {
            // Admin View: Get participants to score
            const [comp, parts, results] = await Promise.all([
                getCompetitionById(id),
                getParticipantsForScoring(id),
                getResults(id)
            ]);
            setCompetition(comp);
            setParticipants(parts);
            setExistingResults(results);

            const initialScores = {};
            results.forEach(r => {
                const key = comp.type === 'team' ? r.team?._id : r.user?._id;
                if (key) initialScores[key] = { score: r.score, position: r.position };
            });
            setScores(initialScores);
        } else {
            // Student View: Get only results
            const [comp, results] = await Promise.all([
                getCompetitionById(id),
                getResults(id)
            ]);
            setCompetition(comp);
            setExistingResults(results);
        }
        setLoading(false);
    }

    const handleInputChange = (pid, field, value) => {
        setScores(prev => ({ ...prev, [pid]: { ...prev[pid], [field]: value } }));
    };

    const handleSave = async (participant) => {
        const pid = competition.type === 'team' ? participant.team._id : participant.user._id;
        const data = scores[pid];
        if (!data || !data.score || !data.position) return alert("Enter score and position");

        setSaving(pid);
        const res = await submitScore(id, pid, data.score, data.position, competition.type === 'team' ? 'team' : 'user');
        setSaving(null);
        if (res.error) alert(res.error);
    };

    const handlePublish = async () => {
        if (!confirm('Are you sure you want to publish these results to all users?')) return;
        setLoading(true);
        const res = await publishResults(id);
        setLoading(false);
        if (res.error) {
            alert(res.error);
        } else {
            alert('Results published successfully!');
            loadData();
        }
    };

    if (loading) return <div className="text-white text-center p-12">Loading...</div>;
    if (!competition) return <div className="text-white text-center">Competition not found</div>;

    const ResultsTable = () => (
        <div className="space-y-8">
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-300 text-sm uppercase">
                            <tr>
                                <th className="p-4">Rank</th>
                                <th className="p-4">Participant</th>
                                <th className="p-4">Score</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {existingResults.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No results found.</td></tr>
                            ) : (
                                existingResults.map((r) => (
                                    <tr key={r._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 flex items-center gap-2">
                                            {r.position === 1 && <Trophy className="w-5 h-5 text-yellow-400" />}
                                            {r.position === 2 && <Trophy className="w-5 h-5 text-gray-400" />}
                                            {r.position === 3 && <Trophy className="w-5 h-5 text-amber-600" />}
                                            <span className={r.position <= 3 ? "font-bold text-white" : "text-slate-300"}>
                                                {r.position}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-white">
                                            {competition.type === 'team' ? r.team?.name : r.user?.name}
                                        </td>
                                        <td className="p-4 text-blue-400 font-bold">{r.score}</td>
                                        <td className="p-4 text-xs">
                                            {r.published ?
                                                <span className="text-green-400 border border-green-500/30 px-2 py-1 rounded bg-green-500/10">Published</span> :
                                                <span className="text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded bg-yellow-500/10">Draft</span>
                                            }
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    if (!isAdmin) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{competition.title} - Results</h1>
                    <p className="text-slate-400">Official Results</p>
                </div>
                <ResultsTable />
            </div>
        );
    }

    // Admin View with Tabs
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Manage Results</h1>
                    <p className="text-blue-400">{competition.title}</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('scoring')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'scoring' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Scoring
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Preview & Publish
                    </button>
                </div>
            </div>

            {activeTab === 'preview' ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Publish Results</h3>
                            <p className="text-slate-300 text-sm mt-1">
                                Make these results visible to all participants.
                            </p>
                        </div>
                        <Button
                            onClick={handlePublish}
                            className="bg-purple-600 hover:bg-purple-500 gap-2"
                        >
                            <Share className="w-4 h-4" />
                            Publish Now
                        </Button>
                    </div>
                    <ResultsTable />
                </div>
            ) : (
                <>
                    <div className="glass-panel overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-slate-300 text-sm uppercase">
                                    <tr>
                                        <th className="p-4">Rank</th>
                                        <th className="p-4">Participant</th>
                                        <th className="p-4">Score</th>
                                        <th className="p-4">Position</th>
                                        <th className="p-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {participants.map(p => {
                                        const pid = competition.type === 'team' ? p.team?._id : p.user?._id;
                                        const name = competition.type === 'team' ? p.team?.name : p.user?.name;
                                        const current = scores[pid] || {};

                                        return (
                                            <tr key={p._id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <input
                                                        type="number"
                                                        className="w-16 bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-center focus:border-blue-500 outline-none"
                                                        value={current.position || ''}
                                                        onChange={(e) => handleInputChange(pid, 'position', e.target.value)}
                                                        placeholder="#"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-white">{name}</div>
                                                </td>
                                                <td className="p-4">
                                                    <input
                                                        type="number"
                                                        className="w-24 bg-black/20 border border-white/10 rounded px-2 py-1 text-white focus:border-blue-500 outline-none"
                                                        placeholder="Score"
                                                        value={current.score || ''}
                                                        onChange={(e) => handleInputChange(pid, 'score', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-4 text-white font-mono">{current.position || '-'}</td>
                                                <td className="p-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSave(p)}
                                                        disabled={saving === pid}
                                                        className="bg-blue-600 hover:bg-blue-500"
                                                    >
                                                        {saving === pid ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg text-yellow-200 text-sm">
                        Note: Scores are saved as drafts. You must click "Publish Results" to make them visible to students.
                    </div>
                </>
            )}
        </div>
    );
}
