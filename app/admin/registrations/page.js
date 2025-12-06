"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';

export default function AdminRegistrations() {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchList(); }, []);
  async function fetchList() {
    const res = await fetch('/api/registrations');
    const data = await res.json();
    setRegs(data.registrations || []);
    setLoading(false);
  }

  async function cancel(id) {
    if (!confirm('Cancel this registration?')) return;
    const res = await fetch(`/api/registrations?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setRegs(regs.filter(r => r.id !== id));
    } else {
      alert('Failed to cancel');
    }
  }

  return (
    <Layout>
      <div className="py-8">
        <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">Manage Registrations</h2>

        <div className="space-y-4">
          {loading ? <p className="text-slate-400">Loading...</p> : regs.map((r, i) => (
            <div key={r.id} className="p-4 glass-panel flex flex-col md:flex-row justify-between items-center group hover:bg-white/5 transition-colors" style={{ animationDelay: `${i * 50}ms` }}>
              <div>
                <div className="font-bold text-slate-100">{r.name}</div>
                <div className="text-sm text-slate-400 mt-1">{r.email}</div>
                <div className="text-xs text-blue-300 mt-2 bg-blue-500/10 inline-block px-2 py-1 rounded border border-blue-500/20">
                  {r.competition_title || `Competition #${r.competition_id}`}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                <span className="text-xs text-slate-500 font-mono">{r.created_at}</span>
                <button onClick={() => cancel(r.id)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-medium border border-red-500/20">
                  Cancel Registration
                </button>
              </div>
            </div>
          ))}
          {!loading && regs.length === 0 && <p className="text-slate-400">No registrations found.</p>}
        </div>
      </div>
    </Layout>
  );
}
