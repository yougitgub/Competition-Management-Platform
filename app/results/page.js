import React from 'react';
import Layout from '../../components/Layout';
import db from '@/lib/db';

export default async function ResultsPage({ searchParams }) {
  const q = (searchParams && searchParams.q) || '';
  let results;
  if (q) {
    results = db.prepare("SELECT r.*, u.name, u.email, c.title as competition_title FROM results r JOIN users u ON u.id = r.student_id JOIN competitions c ON c.id = r.competition_id WHERE u.name LIKE ? ORDER BY r.position ASC").all(`%${q}%`);
  } else {
    results = db.prepare('SELECT r.*, u.name, u.email, c.title as competition_title FROM results r JOIN users u ON u.id = r.student_id JOIN competitions c ON c.id = r.competition_id ORDER BY c.start_date DESC, r.position ASC').all();
  }

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">Results & Leaderboards</h1>
        <form className="mb-8" action="/results" method="get">
          <div className="relative max-w-lg">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search student name..."
              className="glass-input pl-12"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>
        <div className="space-y-4">
          {results.map((r, i) => (
            <div
              key={r.id}
              className="p-6 glass-panel flex flex-col md:flex-row md:items-center justify-between animate-enter hover:bg-white/5 transition-colors"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div>
                <div className="font-bold text-lg text-slate-100 mb-1">{r.name}</div>
                <div className="text-sm text-slate-400">{r.email}</div>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-sm text-slate-400 mb-1">{r.competition_title || r.competition_id}</div>
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
          ))}
        </div>
      </div>
    </Layout>
  );
}
