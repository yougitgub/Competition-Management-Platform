import { getCompetitionById } from '@/actions/competition-actions';
import { getTeams } from '@/actions/team-actions';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trophy, Calendar, MapPin, Users, Award, Edit } from 'lucide-react';
import RegisterIndividual from '@/components/competitions/RegisterIndividual';
import RegisterTeam from '@/components/competitions/RegisterTeam';
import EndCompetitionButton from '@/components/competitions/EndCompetitionButton';

export default async function CompetitionDetailsPage({ params }) {
    const { id } = await params;
    const competition = await getCompetitionById(id);
    const session = await auth();

    if (!competition) {
        return (
            <div className="glass-panel p-12 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                <h2 className="text-2xl font-bold text-white mb-2">Competition Not Found</h2>
                <p className="text-slate-400 mb-6">The competition you're looking for doesn't exist.</p>
                <Link href="/dashboard/competitions">
                    <Button>Back to Competitions</Button>
                </Link>
            </div>
        );
    }

    const teams = competition.type === 'team' ? await getTeams(id) : [];
    const isUpcoming = competition.status === 'upcoming';
    const isActive = competition.status === 'active';
    const isCompleted = competition.status === 'completed';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{competition.title}</h1>
                    <p className="text-slate-400">{competition.category}</p>
                </div>
                {session?.user?.role === 'admin' && (
                    <Link href={`/dashboard/competitions/${id}/edit`}>
                        <Button variant="outline" className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                        </Button>
                    </Link>
                )}
            </div>

            {/* Status Badge */}
            <div>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${isUpcoming ? 'bg-yellow-500/20 text-yellow-300' :
                    isActive ? 'bg-green-500/20 text-green-300' :
                        'bg-gray-500/20 text-gray-300'
                    }`}>
                    {competition.status}
                </span>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                        <p className="text-slate-300 leading-relaxed">{competition.description}</p>
                    </div>

                    <div className="glass-panel p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Rules & Guidelines</h2>
                        <div className="text-slate-300 font-sans text-sm space-y-2">
                            {Array.isArray(competition.rules) && competition.rules.length > 0 ? (
                                <ul className="list-disc pl-5 space-y-1">
                                    {competition.rules.map((rule, idx) => (
                                        <li key={idx}>{rule}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No specific rules listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Teams List for Team Competitions */}
                    {competition.type === 'team' && teams.length > 0 && (
                        <div className="glass-panel p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Registered Teams</h2>
                            <div className="space-y-3">
                                {teams.map((team) => (
                                    <div key={team._id} className="bg-white/5 p-4 rounded-lg">
                                        <h3 className="font-semibold text-white">{team.name}</h3>
                                        <p className="text-sm text-slate-400">
                                            {team.members?.length || 0} members
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Details & Actions */}
                <div className="space-y-6">
                    {/* Details Card */}
                    <div className="glass-panel p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Dates</p>
                                    <p className="text-slate-300 text-sm mt-1">
                                        {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Location</p>
                                    <p className="text-slate-300 text-sm mt-1">{competition.location}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Type</p>
                                    <p className="text-slate-300 text-sm mt-1 capitalize">
                                        {competition.type || 'individual'}
                                    </p>
                                </div>
                            </div>

                            {competition.maxParticipants && (
                                <div className="flex items-start gap-3">
                                    <Award className="w-5 h-5 text-blue-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase">Max Participants</p>
                                        <p className="text-slate-300 text-sm mt-1">{competition.maxParticipants}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="glass-panel p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
                        <div className="space-y-3">
                            {/* Student Registration */}
                            {session?.user?.role === 'student' && isUpcoming && (
                                competition.type === 'team' ? (
                                    <RegisterTeam competitionId={id} />
                                ) : (
                                    <RegisterIndividual competitionId={id} />
                                )
                            )}

                            {/* Judge Scoring */}
                            {session?.user?.role === 'judge' && isActive && (
                                <Link href={`/dashboard/competitions/${id}/score`} className="block">
                                    <Button className="w-full bg-green-600 hover:bg-green-500">
                                        Start Scoring
                                    </Button>
                                </Link>
                            )}

                            {/* Admin Actions */}
                            {session?.user?.role === 'admin' && (
                                <>
                                    <Link href={`/dashboard/competitions/${id}/teams`} className="block">
                                        <Button className="w-full" variant="outline">
                                            Manage Participants
                                        </Button>
                                    </Link>
                                    <Link href={`/dashboard/competitions/${id}/score`} className="block">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                                            Manage Results & Scores
                                        </Button>
                                    </Link>
                                    <Link href={`/dashboard/competitions/${id}/certificates`} className="block">
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                                            Issue Certificates
                                        </Button>
                                    </Link>
                                    <EndCompetitionButton competitionId={id} status={competition.status} />
                                </>
                            )}

                            {/* View Results */}
                            {isCompleted && (
                                <Link href={`/dashboard/results/${id}`} className="block">
                                    <Button className="w-full bg-purple-600 hover:bg-purple-500">
                                        View Results
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
