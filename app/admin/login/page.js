'use client';
import React from 'react';

export default function AdminLogin() {
  async function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get('email');
    const password = fd.get('password');
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (res.ok) window.location.href = '/admin/dashboard';
    else alert('Login failed');
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 glass-panel animate-enter relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
        <h1 className="text-3xl font-bold mb-2 text-center text-white">Admin Access</h1>
        <p className="text-slate-400 text-center mb-8">Secure administrative login</p>

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Admin Email</label>
            <input name="email" type="email" placeholder="admin@school.edu" className="glass-input placeholder-slate-500 text-slate-200" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <input name="password" type="password" placeholder="••••••••" className="glass-input placeholder-slate-500 text-slate-200" required />
          </div>

          <button className="w-full py-3 mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02]">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
