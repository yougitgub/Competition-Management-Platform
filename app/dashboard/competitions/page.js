import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCompetitions } from '@/actions/competition-actions';
import { auth } from '@/auth';
import { Trophy, Calendar, MapPin, Users } from 'lucide-react';

export default async function CompetitionsListPage() {
    const session = await auth();
    const competitions = await getCompetitions();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">All Competitions</h1>
                {session?.user?.role === 'admin' && (
                    <Link href="/dashboard/competitions/create">
                        <Button className="bg-blue-600 hover:bg-blue-500">Create Competition</Button>
                    </Link>
                )}
            </div>

            {competitions.length === 0 ? (
                <div className="glass-panel p-12 text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                    <p className="text-slate-400">No competitions available yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {competitions.map((comp) => (
                        <Link key={comp._id} href={`/dashboard/competitions/${comp._id}`}>
                            <div className="glass-panel p-6 hover:bg-white/10 transition-all group cursor-pointer h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <Trophy className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${comp.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-300' :
                                            comp.status === 'active' ? 'bg-green-500/20 text-green-300' :
                                                'bg-gray-500/20 text-gray-300'
                                        }`}>
                                        {comp.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                    {comp.title}
                                </h3>

                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{comp.description}</p>

                                <div className="space-y-2 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(comp.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{comp.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span className="capitalize">{comp.type || 'individual'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
