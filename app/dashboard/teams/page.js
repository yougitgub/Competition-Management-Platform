'use client';

import { useState, useEffect } from 'react';
import { getTeams, joinTeam, cancelJoinRequest } from '@/actions/team-actions';
import Link from 'next/link';
import { Users, Plus, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function TeamsListPage() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        loadTeams();
    }, []);

    async function loadTeams() {
        setLoading(true);
        const data = await getTeams();
        setTeams(data || []);
        setLoading(false);
    }

    async function handleJoin(teamId) {
        setActionLoading(prev => ({ ...prev, [teamId]: 'join' }));
        const result = await joinTeam(teamId);
        if (result.success) {
            await loadTeams();
            alert(result.success);
        } else {
            alert(result.error);
        }
        setActionLoading(prev => ({ ...prev, [teamId]: null }));
    }

    async function handleCancelRequest(teamId) {
        setActionLoading(prev => ({ ...prev, [teamId]: 'cancel' }));
        const result = await cancelJoinRequest(teamId);
        if (result.success) {
            await loadTeams();
            alert(result.success);
        } else {
            alert(result.error);
        }
        setActionLoading(prev => ({ ...prev, [teamId]: null }));
    }

    function getUserStatus(team, userId) {
        if (!userId) return 'not-member';

        const isMember = team.members.some(m => m._id === userId);
        if (isMember) return 'member';

        const hasPendingRequest = team.joinRequests?.some(r => r._id === userId);
        if (hasPendingRequest) return 'pending';

        return 'not-member';
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Browse Teams</h1>
                    <p className="text-slate-400">Join a team or create your own</p>
                </div>
                <Link href="/dashboard/teams/create">
                    <button className="glass-button px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center gap-2 shadow-lg hover:shadow-blue-500/25 transition-all">
                        <Plus className="w-5 h-5" />
                        Create New Team
                    </button>
                </Link>
            </div>

            {/* Teams Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.length > 0 ? (
                    teams.map((team, index) => {
                        const status = getUserStatus(team, null); // We'll need to get userId from client
                        const isLoading = actionLoading[team._id];

                        return (
                            <div
                                key={team._id}
                                className="glass-panel p-6 hover:bg-white/5 transition-all group animate-enter relative overflow-hidden"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Background Decoration */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Header */}
                                <div className="relative z-10 flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-white group-hover:text-blue-300 transition-colors mb-1">
                                            {team.name}
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Led by {team.leader?.name || 'Unknown'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs text-slate-300 font-medium">
                                            {team.members.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-slate-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                    {team.description || "No description provided."}
                                </p>

                                {/* Competition */}
                                <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/5">
                                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Competition</p>
                                    <p className="text-sm text-blue-400 font-medium">{team.competition?.title || 'Unknown'}</p>
                                </div>

                                {/* Action Button */}
                                <div className="border-t border-white/10 pt-4">
                                    <TeamActionButton
                                        team={team}
                                        onJoin={() => handleJoin(team._id)}
                                        onCancelRequest={() => handleCancelRequest(team._id)}
                                        loading={isLoading}
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-20 glass-panel">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Teams Yet</h3>
                        <p className="text-slate-400 mb-6">Be the first to create a team!</p>
                        <Link href="/dashboard/teams/create">
                            <button className="glass-button px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold">
                                Create Team
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

// Separate component to access session
function TeamActionButton({ team, onJoin, onCancelRequest, loading }) {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Get current user ID from session
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => setUserId(data.user?.id));
    }, []);

    if (!userId) return null;

    const isMember = team.members.some(m => m._id === userId);
    const hasPendingRequest = team.joinRequests?.some(r => r._id === userId);
    const isLeader = team.leader?._id === userId;

    if (isMember) {
        return (
            <Link href="/dashboard/teams/my-team" className="block">
                <button className="w-full py-2.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 font-medium flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {isLeader ? 'Manage Team' : 'View Team'}
                </button>
            </Link>
        );
    }

    if (hasPendingRequest) {
        return (
            <button
                onClick={onCancelRequest}
                disabled={loading === 'cancel'}
                className="w-full py-2.5 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-medium flex items-center justify-center gap-2 hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
            >
                {loading === 'cancel' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Clock className="w-4 h-4" />
                        Cancel Request
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            onClick={onJoin}
            disabled={loading === 'join'}
            className="w-full py-2.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium flex items-center justify-center gap-2 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
        >
            {loading === 'join' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    <Plus className="w-4 h-4" />
                    Request to Join
                </>
            )}
        </button>
    );
}
