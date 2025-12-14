import React from 'react';
import Layout from '../../components/Layout';
import CompetitionCard from '../../components/CompetitionCard';
import { getCompetitions } from '@/actions/competition-actions';

export default async function CompetitionsPage() {
  const competitions = await getCompetitions();

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-tight animate-enter">Upcoming Competitions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.length > 0 ? (
            competitions.map((c) => (
              <CompetitionCard key={c._id} comp={c} />
            ))
          ) : (
            <p className="text-slate-400">No competitions found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
