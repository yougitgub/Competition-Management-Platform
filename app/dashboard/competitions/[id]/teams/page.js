import { getCompetitionRegistrations } from '@/actions/registration-actions';
import { getCompetitionById } from '@/actions/competition-actions';
import { Users, User, Shield } from 'lucide-react';

export default async function ManageTeamsPage({ params }) {
    const { id } = await params;
    const [competition, registrations] = await Promise.all([
        getCompetitionById(id),
        getCompetitionRegistrations(id)
    ]);

    if (!competition) return <div>Competition not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Participants: {competition.title}</h1>

            <div className="glass-panel overflow-hidden">
                {registrations.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        No participants registered yet.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-300 text-sm uppercase">
                            <tr>
                                <th className="p-4">Type</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {registrations.map((reg) => (
                                <tr key={reg._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        {reg.team ? (
                                            <span className="flex items-center gap-2 text-blue-300">
                                                <Shield className="w-4 h-4" /> Team
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-purple-300">
                                                <User className="w-4 h-4" /> Individual
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium text-white">
                                        {reg.team ? reg.team.name : reg.user?.name}
                                        {reg.team && <div className="text-xs text-slate-500">Leader: {reg.user?.name}</div>}
                                        {!reg.team && <div className="text-xs text-slate-500">{reg.user?.email}</div>}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${reg.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                                                reg.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                                                    'bg-yellow-500/20 text-yellow-300'
                                            }`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400 text-sm">
                                        {new Date(reg.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
