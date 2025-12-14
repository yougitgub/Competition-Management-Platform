import { auth } from '@/auth';
import { getAllTeamsAdmin } from '@/actions/team-actions';
import { Users, Crown, Calendar, Trophy } from 'lucide-react';
import Link from 'next/link';

export default async function AdminAllTeamsPage() {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
        return <div className="text-white text-center p-12">Unauthorized</div>;
    }

    const teams = await getAllTeamsAdmin();

    if (teams.error) {
        return <div className="text-red-400 text-center p-12">{teams.error}</div>;
    }

    return (
        <div className="space-y-8 py-8">
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">All Teams</h1>
                <p className="text-slate-400">View and manage all competition teams</p>
            </div>

            {teams.length === 0 ? (
                <div className="glass-panel p-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Teams Yet</h3>
                    <p className="text-slate-400">Teams will appear here once students create them</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {teams.map((team, index) => (
                        <div
                            key={team._id}
                            className="glass-panel p-8 animate-enter"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Team Header */}
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h2 className="text-2xl font-bold text-white">{team.name}</h2>
                                        <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                                            <Trophy className="w-3 h-3" />
                                            {team.members.length} Members
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Crown className="w-4 h-4 text-yellow-500" />
                                            <span>Leader: <span className="text-white font-medium">{team.leader?.name || 'Unknown'}</span></span>
                                        </div>
                                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Trophy className="w-4 h-4 text-purple-500" />
                                            <span className="text-purple-400 font-medium">{team.competition?.title || 'Unknown'}</span>
                                        </div>
                                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(team.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {team.description && (
                                        <p className="mt-3 text-slate-300 text-sm p-3 bg-white/5 rounded-lg border border-white/5">
                                            {team.description}
                                        </p>
                                    )}
                                </div>

                                {/* Join Requests Badge */}
                                {team.joinRequests && team.joinRequests.length > 0 && (
                                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-3 text-center">
                                        <p className="text-2xl font-bold text-yellow-400">{team.joinRequests.length}</p>
                                        <p className="text-xs text-yellow-300">Pending Requests</p>
                                    </div>
                                )}
                            </div>

                            {/* Team Members Grid */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4 pb-2 border-b border-white/10">
                                    Team Members ({team.members.length})
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {team.members.map(member => (
                                        <div
                                            key={member._id}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                                {member.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium flex items-center gap-2 truncate">
                                                    {member.name}
                                                    {member._id === team.leader?._id && (
                                                        <Crown className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                                                    )}
                                                </p>
                                                <p className="text-slate-500 text-xs truncate">{member.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pending Join Requests */}
                            {team.joinRequests && team.joinRequests.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <h3 className="text-sm font-semibold text-yellow-400 uppercase mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                                        Pending Join Requests ({team.joinRequests.length})
                                    </h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {team.joinRequests.map(req => (
                                            <div
                                                key={req._id}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-bold">
                                                    {req.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-medium truncate">{req.name}</p>
                                                    <p className="text-slate-400 text-xs truncate">{req.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
