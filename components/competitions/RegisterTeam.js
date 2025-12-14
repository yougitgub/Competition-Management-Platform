'use client';

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RegisterTeam({ competitionId }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [myTeams, setMyTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');

    useEffect(() => {
        // Fetch user's teams where they are leader
        fetchMyTeams();
    }, []);

    async function fetchMyTeams() {
        try {
            const res = await fetch(`/api/teams/my-teams`);
            if (res.ok) {
                const data = await res.json();
                setMyTeams(data.teams || []);
            }
        } catch (error) {
            console.error('Failed to fetch teams');
        }
    }

    async function handleRegister() {
        if (!selectedTeam) {
            setMessage('Please select a team');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    competition_id: competitionId,
                    team_id: selectedTeam
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Team successfully registered!');
            } else {
                setMessage(data.error || 'Failed to register');
            }
        } catch (error) {
            setMessage('An error occurred');
        } finally {
            setLoading(false);
        }
    }

    if (myTeams.length === 0) {
        return (
            <div className="text-center space-y-3">
                <p className="text-sm text-slate-400">You don't have any teams yet.</p>
                <Link href="/dashboard/teams/create">
                    <Button className="w-full bg-green-600 hover:bg-green-500">
                        Create a Team
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="glass-input text-white w-full"
            >
                <option value="">Select Your Team</option>
                {myTeams.map((team) => (
                    <option key={team._id} value={team._id}>
                        {team.name}
                    </option>
                ))}
            </select>

            <Button
                onClick={handleRegister}
                disabled={loading || !selectedTeam}
                className="w-full bg-blue-600 hover:bg-blue-500"
            >
                {loading ? 'Registering...' : 'Register Team'}
            </Button>

            {message && (
                <p className={`text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </p>
            )}

            <Link href="/dashboard/teams/create">
                <Button variant="outline" className="w-full text-sm">
                    Create New Team
                </Button>
            </Link>
        </div>
    );
}
