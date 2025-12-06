"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import { jsPDF } from 'jspdf';

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectedComp, setSelectedComp] = useState('');
  const [form, setForm] = useState({ student_id: '', position: '', score: '' });

  useEffect(() => {
    fetch('/api/competitions').then(res => res.json()).then(data => setCompetitions(data.competitions));
    fetch('/api/users?role=student').then(res => res.json()).then(data => setUsers(data.users));
    fetchResults();
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

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Manage Results</h1>

        <div className="glass-panel p-6 mb-8 animate-enter">
          <h2 className="text-xl font-semibold text-white mb-4">Add result</h2>
          <div className="mb-4">
            <label className="block text-sm text-slate-300 mb-2">Select Competition</label>
            <select
              value={selectedComp}
              onChange={e => setSelectedComp(e.target.value)}
              className="glass-input text-slate-200 bg-slate-800/50"
            >
              <option value="">-- Choose Competition --</option>
              {competitions.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>

          <form onSubmit={addResult} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={form.student_id}
              onChange={e => setForm({ ...form, student_id: e.target.value })}
              className="glass-input text-slate-200 bg-slate-800/50"
              required
            >
              <option value="">-- Select Student --</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
            <input
              placeholder="Position (e.g. 1)"
              type="number"
              value={form.position}
              onChange={e => setForm({ ...form, position: e.target.value })}
              className="glass-input text-slate-200"
            />
            <input
              placeholder="Score (e.g. 95.5)"
              type="number"
              step="0.1"
              value={form.score}
              onChange={e => setForm({ ...form, score: e.target.value })}
              className="glass-input text-slate-200"
            />
            <div className="md:col-span-3 flex justify-end">
              <button type="submit" className="glass-button px-6 py-2 text-white rounded-lg font-bold" disabled={!selectedComp}>
                Save Result
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">Results List</h3>
          <div className="grid gap-4">
            {displayedResults.map((r, i) => (
              <div key={r.id} className="p-4 glass-panel flex flex-col md:flex-row justify-between items-center group hover:bg-white/5 transition-colors" style={{ animationDelay: `${i * 50}ms` }}>
                <div>
                  <div className="font-bold text-slate-100 text-lg">
                    <span className="text-yellow-400 mr-2">#{r.position}</span>
                    {r.name}
                  </div>
                  <div className="text-sm text-slate-400">{r.email} • {r.competition_title || 'Competition ' + r.competition_id}</div>
                </div>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">{r.score}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest">Score</div>
                  </div>
                  <button onClick={() => generateCertificate(r)} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-bold border border-emerald-500/20">
                    Certificate
                  </button>
                </div>
              </div>
            ))}
            {displayedResults.length === 0 && <p className="text-slate-400">No results found.</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
