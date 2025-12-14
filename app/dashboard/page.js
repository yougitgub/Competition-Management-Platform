import { auth } from '@/auth';
import { getCompetitions } from '@/actions/competition-actions';
import Link from 'next/link';
import { Users, Trophy, ClipboardList, Award, Settings, Activity } from 'lucide-react';

export default async function Page() {
  const session = await auth();
  const competitions = await getCompetitions();

  const isAdmin = session?.user?.role === 'admin';

  if (isAdmin) {
    const adminCards = [
      {
        title: "Manage Competitions",
        href: "/dashboard/competitions",
        icon: <Trophy className="w-8 h-8 text-purple-300" />,
        description: "Create, edit, and manage all competitions",
        color: "from-purple-500/20 to-indigo-500/20",
        border: "border-purple-500/30"
      },
      {
        title: "Registrations",
        href: "/dashboard/registrations",
        icon: <ClipboardList className="w-8 h-8 text-blue-300" />,
        description: "View and manage student registrations",
        color: "from-blue-500/20 to-cyan-500/20",
        border: "border-blue-500/30"
      },
      {
        title: "Manage Results",
        href: "/dashboard/results",
        icon: <Activity className="w-8 h-8 text-emerald-300" />,
        description: "Input scores and publish results",
        color: "from-emerald-500/20 to-teal-500/20",
        border: "border-emerald-500/30"
      },
      {
        title: "Certificates",
        href: "/dashboard/certificates",
        icon: <Award className="w-8 h-8 text-amber-300" />,
        description: "Generate and distribute certificates",
        color: "from-amber-500/20 to-orange-500/20",
        border: "border-amber-500/30"
      },
      {
        title: "User Management",
        href: "/dashboard/users",
        icon: <Users className="w-8 h-8 text-rose-300" />,
        description: "Manage students, teachers, and admins",
        color: "from-rose-500/20 to-pink-500/20",
        border: "border-rose-500/30"
      },
    ];

    return (
      <main>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Welcome back, {session?.user?.name}. Manage your platform here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card, i) => (
            <Link
              key={card.title}
              href={card.href}
              className={`glass-panel p-8 group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 border ${card.border}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="mb-4 bg-white/5 w-fit p-3 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  // Stats mock for now, or fetch
  const stats = [
    { title: "Active Competitions", value: competitions.length },
    { title: "Your Registrations", value: "0" },
    { title: "Upcoming Events", value: "0" }
  ];

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl font-bold text-white">
        Dashboard - Welcome, {session?.user?.name}
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 py-4 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="glass-panel p-6">
            <h3 className="text-sm font-medium text-slate-400">{stat.title}</h3>
            <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4 text-white">Available Competitions</h2>
        {competitions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {competitions.map((comp) => (
              <div key={comp._id} className="glass-panel p-6 border-l-4 border-l-blue-500 hover:border-l-blue-400 transition-all hover:bg-white/5 group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">{comp.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${comp.type === 'team' ? 'bg-purple-500/20 text-purple-300' :
                    comp.type === 'mixed' ? 'bg-orange-500/20 text-orange-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                    {comp.type === 'team' ? 'Team' : comp.type === 'mixed' ? 'Mixed' : 'Individual'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{comp.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span>{new Date(comp.startDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{comp.location}</span>
                </div>
                <Link
                  href={`/dashboard/competitions/${comp._id}`}
                  className="block text-center w-full text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/20"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 text-center text-slate-400">
            No competitions available at the moment.
          </div>
        )}
      </div>
    </main>
  )
}
