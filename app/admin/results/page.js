"use client";

import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import ResultsManager from '@/app/dashboard/results/manage/results-manager';
import { getCompetitionsStats } from '@/actions/result-actions';
import { Trophy, Plus, Save, Award, Search, User, Target, FileText } from 'lucide-react';

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedComp, setSelectedComp] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ student_id: '', position: '', score: '' });

  useEffect(() => {
    Promise.all([
      fetch('/api/competitions').then(res => res.json()),
      fetch('/api/users?role=student').then(res => res.json()),
      getCompetitionsStats(),
      fetch('/api/results').then(res => res.json())
    ]).then(([compsData, usersData, statsData, resultsData]) => {
      setCompetitions(compsData.competitions || []);
      setUsers(usersData.users || []);
      setStats(statsData || []);
      setResults(resultsData.results || []);
      setLoading(false);
    });
  }, []);

  async function fetchResults() {
    const res = await fetch('/api/results');
    const data = await res.json();
    setResults(data.results || []);
  }

  async function addResult(e) {
    e.preventDefault();
    if (!selectedComp) return alert('Select a competition first');

    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, competition_id: selectedComp })
    });

    if (res.ok) {
      setForm({ student_id: '', position: '', score: '' });
      fetchResults();
      // Also refresh stats to show updated counts in the manager
      getCompetitionsStats().then(setStats);
    } else {
      alert('Failed to add result');
    }
  }

  function generateCertificate(r) {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Background params
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Border
    doc.setDrawColor(50, 50, 100);
    doc.setLineWidth(2);
    doc.rect(10, 10, width - 20, height - 20);

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(40, 40, 40);
    doc.text("Certificate of Achievement", width / 2, 50, { align: "center" });

    // Body
    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text("This is to certify that", width / 2, 80, { align: "center" });

    doc.setFontSize(30);
    doc.setFont("times", "bolditalic");
    doc.setTextColor(0, 100, 200);
    doc.text(r.name, width / 2, 100, { align: "center" });

    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    doc.text("has successfully achieved", width / 2, 120, { align: "center" });

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(`Rank #${r.position}`, width / 2, 135, { align: "center" });

    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text(`in the competition`, width / 2, 150, { align: "center" });

    doc.setFontSize(26);
    doc.setTextColor(0, 100, 200);
    doc.text(r.competition_title || 'Competition', width / 2, 165, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`Awarded on ${dateStr}`, width / 2, 185, { align: "center" });

    doc.save(`Certificate_${r.name.replace(/\s+/g, '_')}.pdf`);
  }

  // Filter results by selected competition if any
  const displayedResults = selectedComp
    ? results.filter(r => r.competition_id == selectedComp)
    : results;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading Results...
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Results</h1>
          <p className="text-slate-400">Record scores and publish competition outcomes</p>
        </div>
      </div>

      {/* Status Cards */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Competition Overview
        </h2>
        <ResultsManager initialData={stats} key={stats.length} />
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add Result Form */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-400" />
              Manual Entry
            </h2>

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Competition</label>
              <select
                value={selectedComp}
                onChange={e => setSelectedComp(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Select Competition...</option>
                {competitions.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <form onSubmit={addResult} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Student</label>
                <select
                  value={form.student_id}
                  onChange={e => setForm({ ...form, student_id: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Student...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Position</label>
                  <input
                    placeholder="#"
                    type="number"
                    value={form.position}
                    onChange={e => setForm({ ...form, position: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Score</label>
                  <input
                    placeholder="0.0"
                    type="number"
                    step="0.1"
                    value={form.score}
                    onChange={e => setForm({ ...form, score: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-3 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedComp}
              >
                <Save className="w-4 h-4" />
                Save Result
              </button>
            </form>
          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Recorded Results
            </h3>
            <div className="text-sm text-slate-400 bg-white/5 px-3 py-1 rounded-full">
              {displayedResults.length} records found
            </div>
          </div>

          <div className="grid gap-4">
            {displayedResults.map((r, i) => (
              <div key={r.id} className="glass-panel p-4 flex flex-col md:flex-row justify-between items-center group hover:bg-white/5 transition-colors relative overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className={`
                                flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg shadow-inner
                                ${r.position === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      r.position === 2 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30' :
                        r.position === 3 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30' :
                          'bg-slate-800 text-slate-500'}
                            `}>
                    {r.position}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-lg">{r.name}</div>
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <User className="w-3 h-3" /> {r.email}
                    </div>
                    <div className="text-xs text-blue-400 mt-1">
                      {r.competition_title || 'Competition ' + r.competition_id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{r.score}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Points</div>
                  </div>
                  <button
                    onClick={() => generateCertificate(r)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-sm font-medium border border-white/10"
                  >
                    <FileText className="w-4 h-4" />
                    Certificate
                  </button>
                </div>
              </div>
            ))}
            {displayedResults.length === 0 && (
              <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No results found for the selected criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
