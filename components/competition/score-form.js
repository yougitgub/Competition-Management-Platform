'use client';

import { useState } from 'react';
import { submitScore } from '@/actions/score-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActionState } from 'react';

export function ScoreForm({ competitionId, teams }) {
    const [selectedTeam, setSelectedTeam] = useState('');
    const [state, dispatch, isPending] = useActionState(submitScore, undefined);

    return (
        <form action={dispatch} className="space-y-6 max-w-lg bg-white p-6 rounded-xl shadow-sm dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4">Score Team</h2>
            <input type="hidden" name="competitionId" value={competitionId} />

            <div>
                <label className="block text-sm font-medium mb-2">Select Team</label>
                <select
                    name="teamId"
                    required
                    className="w-full rounded-md border border-gray-200 p-2 dark:bg-gray-950 dark:border-gray-700"
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    value={selectedTeam}
                >
                    <option value="" disabled>Choose a team</option>
                    {teams.map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Score (0-100)</label>
                <Input name="score" type="number" min="0" max="100" step="0.1" required />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                    name="notes"
                    rows={3}
                    className="w-full rounded-md border border-gray-200 p-2 dark:bg-gray-950 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Feedback for the team..."
                />
            </div>

            <Button type="submit" disabled={!selectedTeam || isPending} className="w-full">
                {isPending ? 'Submitting...' : 'Submit Score'}
            </Button>

            {state?.success && <div className="p-3 bg-green-50 text-green-700 rounded-md">{state.success}</div>}
            {state?.error && <div className="p-3 bg-red-50 text-red-500 rounded-md">{state.error}</div>}
        </form>
    );
}
