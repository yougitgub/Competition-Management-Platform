'use client';

import { useState } from 'react';
import { publishResults } from '@/actions/result-actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Share, Eye, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResultsManager({ initialData = [] }) {
    const [competitions, setCompetitions] = useState(initialData);
    const [loadingMap, setLoadingMap] = useState({});

    const handlePublish = async (id) => {
        if (!confirm('Are you sure you want to publish results for this competition?')) return;

        setLoadingMap(prev => ({ ...prev, [id]: true }));
        const res = await publishResults(id);

        if (res.success) {
            // Optimistic update or refresh could be better, but simple state update here
            setCompetitions(prev => prev.map(c =>
                c._id === id ? { ...c, publishedResults: c.totalResults, isPublished: true } : c
            ));
            alert('Results published!');
        } else {
            alert('Failed to publish results.');
        }
        setLoadingMap(prev => ({ ...prev, [id]: false }));
    };

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((comp) => (
                <div key={comp._id} className="glass-panel p-6 flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-white text-lg">{comp.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold 
                                ${comp.status === 'completed' ? 'bg-purple-500/20 text-purple-300' :
                                    comp.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-slate-500/20 text-slate-400'}`}>
                                {comp.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">{comp.participantCount} Participants</p>

                        <div className="bg-black/20 rounded p-3 space-y-2 text-sm">
                            <div className="flex justify-between text-slate-300">
                                <span>Results Entered:</span>
                                <span className="text-white font-mono">{comp.totalResults}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                                <span>Published:</span>
                                <span className={comp.isPublished ? "text-green-400 font-mono" : "text-yellow-400 font-mono"}>
                                    {comp.publishedResults} / {comp.totalResults}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        {comp.totalResults > 0 && !comp.isPublished && (
                            <Button
                                onClick={() => handlePublish(comp._id)}
                                disabled={loadingMap[comp._id]}
                                className="w-full bg-blue-600 hover:bg-blue-500 gap-2"
                            >
                                {loadingMap[comp._id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share className="w-4 h-4" />}
                                Publish All Results
                            </Button>
                        )}

                        {comp.isPublished && comp.totalResults > 0 && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-300 p-2 text-center text-sm rounded flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                All Results Published
                            </div>
                        )}

                        {comp.totalResults === 0 && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-2 text-center text-sm rounded flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                No Results Yet
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                            <Link href={`/dashboard/competitions/${comp._id}/score`} className="w-full">
                                <Button variant="outline" className="w-full text-xs">Manage Scores</Button>
                            </Link>
                            <Link href={`/dashboard/results/${comp._id}`} className="w-full">
                                <Button variant="outline" className="w-full text-xs gap-1">
                                    <Eye className="w-3 h-3" /> View Page
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {competitions.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white/5 rounded-xl text-slate-400">
                    No competitions found.
                </div>
            )}
        </div>
    );
}
