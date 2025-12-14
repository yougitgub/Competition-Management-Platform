import React from 'react';
import Layout from '../../components/Layout';
import CompetitionCard from '../../components/CompetitionCard';
import { getCompetitions } from '@/actions/competition-actions';
import { Search, Trophy, Calendar } from 'lucide-react';

export default async function CompetitionsPage() {
  const competitions = await getCompetitions();
  const activeCompetitions = competitions.filter(c => c.status === 'active' || c.status === 'upcoming');

  return (
    <Layout>
      <div className="pt-24 pb-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Explore Competitions</h1>
            <p className="text-slate-400">Discover upcoming events and showcase your skills</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-xl">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search competitions..."
                className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
              />
            </div>
          </div>
        </div>

        {/* Competitions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCompetitions.length > 0 ? (
            activeCompetitions.map((c, i) => (
              <div key={c._id} className="animate-enter" style={{ animationDelay: `${i * 50}ms` }}>
                <CompetitionCard comp={c} />
              </div>
            ))
          ) : (
            <div className="col-span-full glass-panel p-20 text-center animate-enter">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
                <Calendar className="w-10 h-10 text-slate-400 relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Active Competitions</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Check back later for new events or browse past results.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
