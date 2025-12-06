import React from 'react';
import Layout from '@/components/Layout';
import CompetitionCard from '@/components/CompetitionCard';
import { listCompetitions } from '@/lib/db';

export default async function Home() {
  const competitions = listCompetitions();

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-tight animate-enter">
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Competitions</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitions.map((c) => (
            <CompetitionCard key={c.id} comp={c} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
