"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

export default function AdminAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, fetch from an analytics API. For now, we simulate or fetch raw data and process.
        async function fetchData() {
            const [regsRes, usersRes, compsRes, resultsRes] = await Promise.all([
                fetch('/api/registrations?competition_id=').then(r => r.json()), // All regs
                fetch('/api/users').then(r => r.json()),
                fetch('/api/competitions').then(r => r.json()),
                fetch('/api/results').then(r => r.json())
            ]);

            const regs = regsRes.error ? [] : regsRes.registrations;
            const users = usersRes.users || [];
            const comps = compsRes.competitions || [];
            const results = resultsRes.results || [];

            // Process Stats
            const totalUsers = users.length;
            const totalComps = comps.length;
            const totalRegs = regs.length;

            // Process Chart Data: Registrations per Competition
            const regsPerComp = {};
            regs.forEach(r => {
                const title = r.competition_title || `Comp ${r.competition_id}`;
                regsPerComp[title] = (regsPerComp[title] || 0) + 1;
            });
            const chartData = Object.keys(regsPerComp).map(k => ({ name: k, value: regsPerComp[k] }));

            // Process Scores Distribution (Demo)
            const scores = results.map(r => r.score).filter(s => s != null);
            const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;

            setData({ totalUsers, totalComps, totalRegs, avgScore, chartData });
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <Layout><div className="p-8 text-white">Loading Analytics...</div></Layout>;

    return (
        <Layout>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">Analytics Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Users" value={data.totalUsers} color="blue" />
                    <StatCard title="Active Competitions" value={data.totalComps} color="purple" />
                    <StatCard title="Total Registrations" value={data.totalRegs} color="emerald" />
                    <StatCard title="Average Score" value={data.avgScore} color="yellow" />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 animate-enter" style={{ animationDelay: '100ms' }}>
                        <h3 className="text-xl font-semibold text-white mb-6">Registrations by Competition</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-panel p-6 animate-enter" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-xl font-semibold text-white mb-6">Participation Trends</h3>
                        <div className="h-[300px] flex items-center justify-center text-slate-400">
                            (More data needed for trend analysis)
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function StatCard({ title, value, color }) {
    const colors = {
        blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };

    return (
        <div className={`glass-panel p-6 border ${colors[color].split(' ')[2]} flex flex-col items-center justify-center animate-enter`}>
            <div className={`text-4xl font-bold mb-2 ${colors[color].split(' ')[1]}`}>{value}</div>
            <div className="text-sm text-slate-400 uppercase tracking-widest">{title}</div>
        </div>
    );
}
