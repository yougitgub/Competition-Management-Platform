"use client";
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { use } from 'react';

export default function EditCompetitionPage({ params }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/competitions/${id}`)
            .then(res => res.json())
            .then(data => {
                setForm(data.competition);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    async function update(e) {
        e.preventDefault();
        const res = await fetch('/api/competitions', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        if (res.ok) {
            alert('Updated successfully');
            window.location.href = '/admin/competitions';
        } else {
            alert('Failed to update');
        }
    }

    if (loading) return <Layout><div className="p-8 text-white">Loading...</div></Layout>;
    if (!form) return <Layout><div className="p-8 text-white">Competition not found</div></Layout>;

    return (
        <Layout>
            <div className="py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Edit Competition</h1>
                    <a href="/admin/competitions" className="text-slate-400 hover:text-white transition-colors">Back to List</a>
                </div>

                <div className="glass-panel p-8 animate-enter">
                    <form onSubmit={update} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Competition Title</label>
                            <input
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                required
                                className="glass-input text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={form.start_date}
                                onChange={e => setForm({ ...form, start_date: e.target.value })}
                                required
                                className="glass-input text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                            <input
                                type="date"
                                value={form.end_date || ''}
                                onChange={e => setForm({ ...form, end_date: e.target.value })}
                                className="glass-input text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Max Participants</label>
                            <input
                                type="number"
                                value={form.max_participants || ''}
                                onChange={e => setForm({ ...form, max_participants: e.target.value })}
                                className="glass-input text-white"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Description (Markdown)</label>
                            <textarea
                                value={form.description || ''}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="glass-input text-white min-h-[150px]"
                            ></textarea>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Rules & Guidelines</label>
                            <textarea
                                value={form.rules || ''}
                                onChange={e => setForm({ ...form, rules: e.target.value })}
                                className="glass-input text-white min-h-[150px]"
                            ></textarea>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                            <a href="/admin/competitions" className="glass-button px-6 py-2 text-slate-300 rounded-lg hover:text-white">Cancel</a>
                            <button type="submit" className="glass-button px-8 py-2 text-white bg-primary/20 rounded-lg font-bold border-primary/50">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
