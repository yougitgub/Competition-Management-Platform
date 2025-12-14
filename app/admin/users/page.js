"use client";
import React, { useEffect, useState } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null); // ID of user being edited
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });

  useEffect(() => { fetchList(); }, []);
  async function fetchList() {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  async function submit(e) {
    e.preventDefault();
    const url = editMode ? `/api/users/${editMode}` : '/api/users';
    const method = editMode ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setForm({ name: '', email: '', password: '', role: 'student' });
      setEditMode(null);
      fetchList();
    } else {
      alert('Operation failed');
    }
  }

  function startEdit(user) {
    setEditMode(user.id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    document.getElementById('user-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  function startCreate() {
    setEditMode(null);
    setForm({ name: '', email: '', password: '', role: 'student' });
  }

  async function del(id) {
    if (!confirm('Delete user?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchList();
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">Manage Users</h2>

      <div id="user-form" className={`glass-panel p-6 mb-8 animate-enter transition-all duration-300 ${editMode ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-200">{editMode ? 'Edit User' : 'Add New User'}</h3>
          {editMode && <button onClick={startCreate} className="text-sm text-slate-400 hover:text-white">Cancel Edit</button>}
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="glass-input text-slate-200 placeholder-slate-500" required />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="glass-input text-slate-200 placeholder-slate-500" required />
          <input placeholder={editMode ? "New Password (optional)" : "Password"} type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="glass-input text-slate-200 placeholder-slate-500" required={!editMode} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="glass-input text-slate-200 bg-slate-800/50">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <div className="md:col-span-2 flex justify-end">
            <button className={`px-6 py-2 glass-button text-white rounded-lg font-medium hover:bg-white/10 ${editMode ? 'bg-blue-500/20 border-blue-500/30' : ''}`}>
              {editMode ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">Existing Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? <p className="text-slate-400">Loading...</p> : users.map((u, i) => (
            <div key={u.id} className="p-4 glass-panel flex justify-between items-center group hover:bg-white/5 transition-colors" style={{ animationDelay: `${i * 50}ms` }}>
              <div>
                <div className="font-bold text-slate-100 flex items-center gap-2">
                  {u.name}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'bg-blue-500/20 text-blue-300 border-blue-500/50'}`}>{u.role}</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">{u.email}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(u)} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-xs font-medium border border-blue-500/20">Edit</button>
                <button onClick={() => del(u.id)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-medium border border-red-500/20">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
