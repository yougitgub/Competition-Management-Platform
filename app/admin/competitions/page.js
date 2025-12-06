"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';

export default function AdminCompetitions() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/competitions')
      .then(res => res.json())
      .then(data => {
        setCompetitions(data.competitions || []);
        setLoading(false);
      });
  }, []);

  async function createCompetition(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const res = await fetch('/api/competitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert('Failed to create');
    }
  }

  async function deleteCompetition(id) {
    if (!confirm('Are you sure? This will delete all registrations and results for this competition.')) return;
    const res = await fetch(`/api/competitions?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCompetitions(competitions.filter(c => c.id !== id));
    } else {
      alert('Failed to delete');
    }
  }

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Manage Competitions</h1>

        {/* Create Form */}
        <div className="glass-panel p-6 mb-8 animate-enter">
          <h2 className="text-xl font-bold text-white mb-4">Create New Competition</h2>
          <form onSubmit={createCompetition} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" placeholder="Competition Title" required className="glass-input text-white" />
            <input name="start_date" type="date" required className="glass-input text-white" />
            <input name="end_date" type="date" className="glass-input text-white" />
            <input name="max_participants" type="number" placeholder="Max Participants" className="glass-input text-white" />
            <textarea name="description" placeholder="Description" className="glass-input text-white md:col-span-2" rows="3"></textarea>
            <div className="md:col-span-2">
              <button type="submit" className="glass-button px-6 py-2 text-white rounded-lg font-bold">Create Competition</button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="grid gap-4">
          {loading ? <p className="text-white">Loading...</p> : competitions.map((c, i) => (
            <div key={c.id} className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-enter" style={{ animationDelay: `${i * 100}ms` }}>
              <div>
                <h3 className="text-xl font-bold text-white">{c.title}</h3>
                <p className="text-slate-400 text-sm">{c.start_date} {c.end_date ? `to ${c.end_date}` : ''}</p>
                <p className="text-slate-300 mt-2">{c.description}</p>
              </div>
              <div className="flex gap-2">
                <a href={`/admin/competitions/${c.id}/edit`} className="glass-button px-4 py-2 text-blue-300 text-sm rounded-lg hover:text-white">Edit</a>
                <button onClick={() => deleteCompetition(c.id)} className="glass-button px-4 py-2 text-red-400 text-sm rounded-lg hover:text-white hover:bg-red-500/10 text-white">Delete</button>
              </div>
            </div>
          ))}
          {competitions.length === 0 && !loading && <p className="text-slate-400">No competitions found.</p>}
        </div>
      </div>
    </Layout>
  );
}
