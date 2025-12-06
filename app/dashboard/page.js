"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function DashboardPage() {
  const [regs, setRegs] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [rRes, resRes] = await Promise.all([
        fetch('/api/registrations').then(r => r.json()),
        fetch('/api/results').then(r => r.json())
      ]);
      setRegs(rRes.registrations || []);
      setResults(resRes.results || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-tight animate-enter">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Registrations Section */}
          <div className="glass-panel p-6 animate-enter" style={{ animationDelay: '100ms' }}>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">Upcoming Competitions</h2>
            {loading ? <p className="text-slate-400">Loading...</p> : (
              <div className="space-y-4">
                {regs.length === 0 ? (
                  <div className="text-slate-500">You have no upcoming competitions. <a href="/competitions" className="text-blue-400 underline">Browse</a></div>
                ) : regs.map(r => (
                  <div key={r.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="font-bold text-white text-lg">{r.competition_title}</h3>
                    <div className="text-sm text-slate-400 mt-1">
                      {r.start_date} — {r.end_date}
                    </div>
                    <div className="mt-3">
                      <span className="text-xs font-bold px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded">REGISTERED</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="glass-panel p-6 animate-enter" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">My Results</h2>
            {loading ? <p className="text-slate-400">Loading...</p> : (
              <div className="space-y-4">
                {results.length === 0 ? (
                  <div className="text-slate-500">No results available yet.</div>
                ) : results.map(r => (
                  <div key={r.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-lg">{r.competition_title}</h3>
                      <div className="text-sm text-slate-400 mt-1">
                        Rank: <span className="text-white font-bold">#{r.position}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{r.score}</div>
                      <div className="text-xs text-slate-500 uppercase">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
