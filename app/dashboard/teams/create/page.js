'use client';

import { createTeam } from '@/actions/team-actions';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { useState, useEffect, useActionState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} className="w-full bg-blue-600 hover:bg-blue-500">
            {pending ? 'Creating Team...' : 'Create Team'}
        </Button>
    );
}

export default function CreateTeamPage() {
    const [state, formAction] = useActionState(createTeam, undefined);
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        fetchCompetitions();
    }, []);

    async function fetchCompetitions() {
        try {
            const res = await fetch('/api/competitions');
            if (res.ok) {
                const data = await res.json();
                // Filter for upcoming team competitions
                const teamComps = data.competitions?.filter(c => c.type === 'team' && c.status === 'upcoming') || [];
                setCompetitions(teamComps);
            }
        } catch (error) {
            console.error('Failed to fetch competitions');
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="glass-panel p-8">
                <h1 className="text-2xl font-bold text-white mb-6">Create a New Team</h1>

                {competitions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-slate-400 mb-4">No team competitions available right now.</p>
                        <Button onClick={() => window.location.href = '/dashboard/competitions'}>
                            View All Competitions
                        </Button>
                    </div>
                ) : (
                    <form action={formAction} className="space-y-4">
                        {state?.error && <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded">{state.error}</div>}
                        {state?.success && <div className="text-green-400 text-sm bg-green-500/10 p-2 rounded">{state.success}</div>}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Team Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="glass-input text-white w-full"
                                placeholder="e.g. The Code Warriors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                className="glass-input text-white w-full"
                                placeholder="Tell us about your team..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Competition</label>
                            <select
                                name="competitionId"
                                required
                                className="glass-input text-white w-full"
                            >
                                <option value="">Select a competition</option>
                                {competitions.map((comp) => (
                                    <option key={comp._id} value={comp._id}>
                                        {comp.title}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400 mt-1">
                                You will be the team leader
                            </p>
                        </div>

                        <SubmitButton />
                    </form>
                )}
            </div>
        </div>
    );
}
