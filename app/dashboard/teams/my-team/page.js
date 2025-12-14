'use client';

import { getMyTeam, handleJoinRequest } from '@/actions/team-actions';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX, Loader2 } from 'lucide-react';

export default function MyTeamPage() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTeams();
    }, []);

    async function loadTeams() {
        const data = await getMyTeam();
        setTeams(data || []);
        setLoading(false);
    }

    async function onAction(teamId, userId, action) {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;

        const res = await handleJoinRequest(teamId, userId, action);
        if (res.success) {
            loadTeams(); // Reload
        } else {
            alert(res.error);
        }
    }

    if (loading) return <div className="text-white text-center p-12">Loading team info...</div>;

    if (teams.length === 0) {
        return (
            <div className="glass-panel p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">No Team Found</h2>
                <p className="text-slate-400 mb-6">You are not part of any team yet.</p>
                <Button onClick={() => window.location.href = '/dashboard/teams'}>Browse Teams</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">My Teams</h1>

            {teams.map(team => (
                <div key={team._id} className="glass-panel p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                            <p className="text-blue-400 text-sm mt-1">{team.competition?.title}</p>
                        </div>
                        <span className="bg-white/10 px-3 py-1 rounded-full text-xs text-slate-300">
                            {team.members.length} Members
                        </span>
                    </div>

                    <p className="text-slate-300 mb-8 p-4 bg-white/5 rounded-lg border border-white/5">
                        {team.description || "No description."}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Members</h3>
                            <ul className="space-y-3">
                                {team.members.map(member => (
                                    <li key={member._id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                                            {member.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{member.name}</p>
                                            <p className="text-slate-500 text-xs">{member.email}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {team.joinRequests && team.joinRequests.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                                    Join Requests
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{team.joinRequests.length}</span>
                                </h3>
                                <ul className="space-y-3">
                                    {team.joinRequests.map(req => (
                                        <li key={req._id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold">
                                                    {req.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm font-medium">{req.name}</p>
                                                    <p className="text-slate-500 text-xs">{req.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onAction(team._id, req._id, 'accept')}
                                                    className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                                    title="Accept"
                                                >
                                                    <UserCheck className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onAction(team._id, req._id, 'reject')}
                                                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                    title="Reject"
                                                >
                                                    <UserX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
