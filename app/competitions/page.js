import React from 'react';
import Layout from '../../components/Layout';
import CompetitionCard from '../../components/CompetitionCard';
import { listCompetitions } from '@/lib/db';

export default function CompetitionsPage() {
  const competitions = listCompetitions();
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-tight animate-enter">Upcoming Competitions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {competitions.map((c) => (
            <CompetitionCard key={c.id} comp={c} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
