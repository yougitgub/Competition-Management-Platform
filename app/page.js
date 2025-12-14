import Link from 'next/link';
import { getCompetitions } from '@/actions/competition-actions';
import { auth } from '@/auth';
import { ArrowRight, Trophy, Users, Award, Sparkles, Zap, Target, LayoutDashboard, LogOut } from 'lucide-react';
import { logout } from '@/actions/auth-actions';
export default async function Home() {
  const session = await auth();
  const competitions = await getCompetitions();
  const upcomingCompetitions = competitions.filter(c => c.status === 'upcoming').slice(0, 3);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none" suppressHydrationWarning>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl opacity-50" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-2xl font-extrabold text-transparent">
              CompManager
            </span>
          </div>
          <div className="flex gap-3">
            {session ? (
              <>
                <Link
                  href={session.user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1">
        <section className="container mx-auto px-6 py-24 text-center">
          <div className="animate-enter">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-purple-500/50">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent sm:text-8xl">
              Manage Competitions
            </h1>
            <h2 className="mt-4 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl">
              With Ease & Style
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-300">
              The all-in-one platform for school competitions. Manage teams, judges, scoring, and results in real-time with a beautiful, intuitive interface.
            </p>
          </div>

          <div className="animate-enter stagger-1 mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="group flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 px-8 text-lg font-semibold text-white shadow-xl shadow-purple-500/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <span className="flex items-center gap-2">
                Start Now <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="#competitions"
              className="flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10"
            >
              View Competitions
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="mb-12 text-center text-4xl font-extrabold text-white">
              Powerful Features
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Trophy,
                  title: 'Competition Management',
                  description: 'Create and manage multiple competition categories, rules, and schedules effortlessly.',
                  gradient: 'from-yellow-500 to-orange-600',
                  color: 'yellow'
                },
                {
                  icon: Users,
                  title: 'Team Registration',
                  description: 'Students can easily register teams and join competitions with a few clicks.',
                  gradient: 'from-blue-500 to-cyan-600',
                  color: 'blue'
                },
                {
                  icon: Award,
                  title: 'Live Scoring',
                  description: 'Judges can submit scores instantly, with automatic ranking and result generation.',
                  gradient: 'from-purple-500 to-pink-600',
                  color: 'purple'
                }
              ].map((feature, i) => (
                <div key={i} className="group animate-enter stagger-1 relative">
                  <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-20 blur transition-all group-hover:opacity-40`} />
                  <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:bg-white/10">
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Competitions */}
        <section id="competitions" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="mb-12 text-center text-4xl font-extrabold text-white">
              Upcoming Events
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {upcomingCompetitions.length > 0 ? upcomingCompetitions.map((comp, i) => (
                <div key={comp._id} className="group animate-enter relative" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur transition-all group-hover:opacity-40" />
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/10">
                    <div className="p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
                          {comp.category}
                        </span>
                        <Zap className="h-5 w-5 text-yellow-400" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-white">{comp.title}</h3>
                      <p className="mb-4 line-clamp-2 text-sm text-gray-300">{comp.description}</p>
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-sm text-gray-400">{new Date(comp.startDate).toISOString().split('T')[0]}</span>
                        <Link href="/login" className="group/link flex items-center gap-1 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300">
                          Register
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
                  <Target className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-gray-400">No upcoming competitions at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 backdrop-blur-xl">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">&copy; 2024 School Competition Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
