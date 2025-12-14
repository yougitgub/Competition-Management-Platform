'use client';

import { getMyTeam, handleJoinRequest, leaveTeam } from '@/actions/team-actions';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserCheck, UserX, Loader2, LogOut, Crown, Users as UsersIcon } from 'lucide-react';

export default function MyTeamPage() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        loadTeams();
        // Get current user ID
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => setUserId(data.user?.id));
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

    async function handleLeaveTeam(teamId) {
        if (!confirm('Are you sure you want to leave this team?')) return;

        const res = await leaveTeam(teamId);
        if (res.success) {
            alert(res.success);
            loadTeams();
        } else {
            alert(res.error);
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );

    if (teams.length === 0) {
        return (
            <div className="glass-panel p-12 text-center animate-enter">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <UsersIcon className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No Team Found</h2>
                <p className="text-slate-400 mb-6">You are not part of any team yet.</p>
                <Button onClick={() => window.location.href = '/dashboard/teams'}>Browse Teams</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">My Teams</h1>
                <p className="text-slate-400">Manage your team memberships and requests</p>
            </div>

            {teams.map((team, index) => {
                const isLeader = team.leader?._id === userId;

                return (
                    <div
                        key={team._id}
                        className="glass-panel p-8 animate-enter"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-bold text-white">{team.name}</h2>
                                    {isLeader && (
                                        <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
                                            <Crown className="w-3 h-3" />
                                            Leader
                                        </span>
                                    )}
                                </div>
                                <p className="text-blue-400 text-sm font-medium mb-1">{team.competition?.title}</p>
                                <p className="text-slate-500 text-sm">Led by {team.leader?.name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 px-4 py-2 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-white">{team.members.length}</p>
                                    <p className="text-xs text-slate-400">Members</p>
                                </div>
                                {!isLeader && (
                                    <button
                                        onClick={() => handleLeaveTeam(team._id)}
                                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Leave Team
                                    </button>
                                )}
                            </div>
                        </div>

                        {team.description && (
                            <p className="text-slate-300 mb-8 p-4 bg-white/5 rounded-lg border border-white/5">
                                {team.description}
                            </p>
                        )}

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                                    <UsersIcon className="w-5 h-5 text-blue-400" />
                                    Team Members
                                </h3>
                                <ul className="space-y-3">
                                    {team.members.map(member => (
                                        <li key={member._id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                                {member.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white text-sm font-medium flex items-center gap-2">
                                                    {member.name}
                                                    {member._id === team.leader?._id && (
                                                        <Crown className="w-3 h-3 text-yellow-400" />
                                                    )}
                                                </p>
                                                <p className="text-slate-500 text-xs">{member.email}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {isLeader && team.joinRequests && team.joinRequests.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                                        Join Requests
                                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{team.joinRequests.length}</span>
                                    </h3>
                                    <ul className="space-y-3">
                                        {team.joinRequests.map(req => (
                                            <li key={req._id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-bold">
                                                        {req.name?.charAt(0).toUpperCase()}
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
                );
            })}
        </div>
    );
}
