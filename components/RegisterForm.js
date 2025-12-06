'use client';
import React, { useState } from 'react';

export default function RegisterForm({ competitionId }) {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: Number(studentId), competition_id: Number(competitionId) })
    });
    const data = await res.json();
    if (res.ok) setMessage('Registered successfully');
    else setMessage(data.error || 'Error');
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-2">Register Now</h3>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Student ID (Prototype)</label>
        <input
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="glass-input placeholder-slate-500 text-slate-200"
          placeholder="Enter ID..."
          required
        />
      </div>

      <button
        disabled={loading}
        className="w-full py-3 glass-button rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Registering...' : 'Register for Competition'}
      </button>

      {message && (
        <p className={`text-sm text-center p-2 rounded ${message.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
