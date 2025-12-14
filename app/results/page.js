import React from 'react';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import Competition from '@/models/Competition';
import User from '@/models/User';
import { Search } from 'lucide-react';
// Ensure models are registered
import '@/models/Team';

export default async function ResultsPage({ searchParams }) {
  const sp = await searchParams; // Next.js 15+ needs await, or fallback
  const q = sp?.q || '';

  await dbConnect();

  let query = {};
  if (q) {
    // Find users matching name
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

  // Sort manually if needed or rely on DB. 
  // Code above sorts by score desc.

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Simple Navbar for this page if Layout is not wrapping it correctly or if we want standalone */}
      {/* Assuming Layout wrapper from root is present */}
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Results & Leaderboards</h1>
        <form className="mb-8" action="/results" method="get">
          <div className="relative max-w-lg">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search participant name..."
              className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-12 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-500 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </form>
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-slate-500">No results found.</div>
          ) : (
            results.map((r, i) => (
              <div
                key={r._id}
                className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between animate-enter hover:bg-white/10 transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div>
                  <div className="font-bold text-lg text-slate-100 mb-1">
                    {r.team ? r.team.name : r.user?.name || 'Unknown'}
                  </div>
                  <div className="text-sm text-slate-400">
                    {r.team ? 'Team Entry' : r.user?.email}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-sm text-slate-400 mb-1">{r.competition?.title}</div>
                  <div className="inline-flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${r.position === 1 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' :
                      r.position === 2 ? 'bg-slate-300/20 text-slate-300 border-slate-300/50' :
                        r.position === 3 ? 'bg-amber-600/20 text-amber-500 border-amber-600/50' :
                          'bg-slate-700/50 text-slate-400 border-slate-600'
                      }`}>
                      Rank #{r.position}
                    </span>
                    <span className="font-mono text-xl font-bold text-white">{r.score} pts</span>
                  </div>
                </div>
              </div>
            )))}
        </div>
      </div>
    </div>
  );
}
