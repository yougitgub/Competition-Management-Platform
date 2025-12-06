import React from 'react';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/RegisterForm';
import { getCompetition } from '@/lib/db';

export default async function CompetitionPage({ params }) {
  const unwrappedParams = await params;
  const c = getCompetition(unwrappedParams.id);

  if (!c) return <Layout><div className="p-8 text-center text-xl text-slate-400">Competition not found</div></Layout>;

  const now = new Date();
  const open = !(c.end_date && new Date(c.end_date) < now);

  return (
    <Layout>
      <div className="glass-panel p-8 animate-enter">
        <div className="border-b border-white/10 pb-6 mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">{c.title}</h1>
          <p className="text-lg text-slate-300 leading-relaxed">{c.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3">Rules & Guidelines</h3>
              <p className="text-slate-300 whitespace-pre-line">{c.rules}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Details</h3>
              <div>
                <span className="block text-xs uppercase text-slate-500 font-bold tracking-wider mb-1">Timeline</span>
                <span className="text-slate-200">{c.start_date} — {c.end_date}</span>
              </div>
              <div>
                <span className="block text-xs uppercase text-slate-500 font-bold tracking-wider mb-1">Availability</span>
                <span className="text-slate-200">{c.max_participants || 'Unlimited'} spots</span>
              </div>
              <div>
                <span className="block text-xs uppercase text-slate-500 font-bold tracking-wider mb-1">Status</span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${open ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                  {open ? 'Registration Open' : 'Closed'}
                </span>
              </div>
            </div>

            {open ? (
              <div className="glass p-6 rounded-xl">
                <RegisterForm competitionId={c.id} />
              </div>
            ) : (
              <div className="glass p-6 rounded-xl text-center text-slate-400">
                Registration is closed.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
