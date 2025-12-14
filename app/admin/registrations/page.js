"use client";
import React, { useEffect, useState } from 'react';
import { getRegistrations, deleteRegistration } from '@/actions/registration-actions';
import { Users, Trash2, Mail, Calendar, Hash, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminRegistrations() {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRegs();
  }, []);

  async function loadRegs() {
    const data = await getRegistrations();
    setRegs(data || []);
    setLoading(false);
  }

  async function handleCancel(id) {
    if (!confirm('Cancel this registration?')) return;
    const res = await deleteRegistration(id);
    if (res.success) {
      setRegs(regs.filter(r => r._id !== id));
      router.refresh();
    } else {
      alert('Failed to cancel');
    }
  }

  return (
    <div className="py-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
          <Users className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Registrations</h1>
          <p className="text-slate-400">View and manage competition enrollments</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4 ml-1">
          <h2 className="text-xl font-bold text-white">Registrations List</h2>
          <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
            Total: {regs.length}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading registrations...</div>
        ) : (
          regs.map((r, i) => (
            <div key={r._id} className="p-6 glass-panel flex flex-col md:flex-row justify-between items-center group hover:bg-white/5 transition-colors animate-enter" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start gap-4">
                <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-500 font-bold border border-slate-700">
                  {r.user?.name?.[0] || 'U'}
                </div>
                <div>
                  <div className="font-bold text-slate-100 text-lg">{r.user?.name || 'Unknown User'}</div>
                  <div className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> {r.user?.email}
                  </div>
                  <div className="text-sm text-blue-300 mt-2 bg-blue-500/10 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20">
                    <Hash className="w-3 h-3" />
                    {r.competition?.title || `Competition #${r.competition}`}
                    {r.team && <span className="text-slate-400"> • Team: {r.team.name}</span>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-black/20 px-2 py-1 rounded">
                  <Calendar className="w-3 h-3" />
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
                <button onClick={() => handleCancel(r._id)} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm font-medium border border-red-500/20 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Cancel Registration
                </button>
              </div>
            </div>
          )))}
        {!loading && regs.length === 0 && (
          <div className="p-12 text-center text-slate-500 glass-panel flex flex-col items-center gap-4">
            <Search className="w-12 h-12 opacity-50" />
            No registrations found.
          </div>
        )}
      </div>
    </div>

  );
}
