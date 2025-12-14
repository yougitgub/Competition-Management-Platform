'use client';

import { getRegistrations, updateRegistrationStatus } from '@/actions/registration-actions';
import { useState, useEffect } from 'react';
import { Check, X, Loader2 } from 'lucide-react';

export default function RegistrationsPage() {
    const [regs, setRegs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const data = await getRegistrations();
        setRegs(data);
        setLoading(false);
    }

    async function handleStatus(id, status) {
        if (!confirm(`Mark this registration as ${status}?`)) return;
        const res = await updateRegistrationStatus(id, status);
        if (res.success) loadData();
        else alert(res.error);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Manage Registrations</h1>

            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-300 text-sm uppercase">
                            <tr>
                                <th className="p-4">Student</th>
                                <th className="p-4">Competition</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading registrations...</td></tr>
                            ) : regs.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No registrations found.</td></tr>
                            ) : (
                                regs.map(reg => (
                                    <tr key={reg._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{reg.user?.name}</div>
                                            <div className="text-xs text-slate-500">{reg.user?.email}</div>
                                        </td>
                                        <td className="p-4 text-slate-300">{reg.competition?.title}</td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {reg.team ? (
                                                <span className="text-purple-400">Team: {reg.team.name}</span>
                                            ) : (
                                                <span className="text-blue-400">Individual</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${reg.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                    reg.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {reg.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {reg.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatus(reg._id, 'approved')}
                                                        className="p-1.5 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatus(reg._id, 'rejected')}
                                                        className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                                        title="Reject"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
