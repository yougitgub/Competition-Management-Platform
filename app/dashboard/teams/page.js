import { auth } from '@/auth';
import { getTeams, joinTeam } from '@/actions/team-actions';
import { JoinTeamButton } from '@/components/teams/JoinTeamButton';
import Link from 'next/link';

export default async function TeamsListPage() {
    const session = await auth();
    const teams = await getTeams(); // Get all teams

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">All Teams</h1>
                <Link href="/dashboard/teams/create">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">
                        Create New Team
                    </button>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.length > 0 ? (
                    teams.map((team) => (
                        <div key={team._id} className="glass-panel p-6 hover:bg-white/5 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl text-white group-hover:text-blue-300 transition-colors">
                                    {team.name}
                                </h3>
                                <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                                    {team.members.length} Members
                                </span>
                            </div>

                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                {team.description || "No description provided."}
                            </p>

                            <div className="mb-4">
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Competition</p>
                                <p className="text-sm text-slate-300">{team.competition?.title || 'Unknown'}</p>
                            </div>

                            <div className="border-t border-white/10 pt-4 mt-auto">
                                <JoinTeamButton team={team} userId={session?.user?.id} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 glass-panel">
                        <p className="text-slate-400">No teams found. Why not create one?</p>
                    </div>
                )}
            </div>
        </div>
    );
}
