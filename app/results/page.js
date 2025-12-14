import React from 'react';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import User from '@/models/User';
import Layout from '../../components/Layout';
import { Search, Trophy, Medal } from 'lucide-react';
// Ensure models are registered
import '@/models/Team';

export default async function ResultsPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || '';

  await dbConnect();

  let query = {};
  if (q) {
    const users = await User.find({ name: { $regex: q, $options: 'i' } });
    const userIds = users.map(u => u._id);
    query = { user: { $in: userIds }, published: true };
  } else {
    query = { published: true };
  }

  const results = await Result.find(query)
    .populate('user', 'name email')
    .populate('team', 'name')
    .populate('competition', 'title startDate')
    .sort({ 'score': -1, 'position': 1 })
    .lean();

  return (
    <Layout>
      <div className="pt-24 pb-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Hall of Fame</h1>
            <p className="text-slate-400">Celebrate the champions and outstanding performances</p>
          </div>
        </div>

        {/* Search Bar */}
        <form action="/results" method="get" className="max-w-md">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-xl">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search participant..."
                className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
              />
            </div>
          </div>
        </form>

        {/* Results List */}
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="glass-panel p-20 text-center animate-enter">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Results Found</h3>
              <p className="text-slate-400">Try adjusting your search criteria or check back later.</p>
            </div>
          ) : (
            results.map((r, i) => (
              <div
                key={r._id}
                className="glass-panel p-6 hover:bg-white/10 transition-all group animate-enter"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Rank and Info */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Rank Badge */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${r.position === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-yellow-500/25' :
                      r.position === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
                        r.position === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                          'bg-white/10 text-slate-400 border border-white/10'
                      }`}>
                      {r.position}
                    </div>

                    {/* Participant Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors truncate">
                          {r.team ? r.team.name : r.user?.name || 'Unknown'}
                        </h3>
                        {r.position <= 3 && (
                          <Medal className={`w-4 h-4 flex-shrink-0 ${r.position === 1 ? 'text-yellow-400' :
                            r.position === 2 ? 'text-slate-300' :
                              'text-amber-600'
                            }`} />
                        )}
                      </div>
                      <div className="text-sm text-slate-400 flex items-center gap-2 flex-wrap">
                        <span className="truncate">{r.team ? 'Team Participant' : r.user?.email}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0"></span>
                        <span className="text-blue-400 truncate">{r.competition?.title}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score */}
                  <div className="flex items-center gap-6 justify-between md:justify-end">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 uppercase font-bold mb-1">Total Score</div>
                      <div className="font-mono text-2xl font-bold text-white">{r.score}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
