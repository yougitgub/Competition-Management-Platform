'use client';

import { useState } from 'react';
import { addJudgeToCompetition, removeJudgeFromCompetition } from '@/actions/competition-actions';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';

export default function ManageJudgesClient({ competition, allJudges }) {
    const [assignedJudges, setAssignedJudges] = useState(competition.judges || []);
    const [loading, setLoading] = useState(false);

    // Filter judges not already assigned
    const availableJudges = allJudges.filter(
        j => !assignedJudges.some(aj => aj._id === j._id)
    );

    const handleAdd = async (judgeId) => {
        setLoading(true);
        const res = await addJudgeToCompetition(competition._id, judgeId);
        if (res.success) {
            // Optimistic update or refresh
            const judge = allJudges.find(j => j._id === judgeId);
            setAssignedJudges([...assignedJudges, judge]);
        }
        setLoading(false);
    };

    const handleRemove = async (judgeId) => {
        setLoading(true);
        const res = await removeJudgeFromCompetition(competition._id, judgeId);
        if (res.success) {
            setAssignedJudges(assignedJudges.filter(j => j._id !== judgeId));
        }
        setLoading(false);
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <ShieldCheck className="text-green-400" /> Assigned Judges
                </h2>
                {assignedJudges.length === 0 ? (
                    <p className="text-slate-400">No judges assigned yet.</p>
                ) : (
                    <div className="space-y-3">
                        {assignedJudges.map(judge => (
                            <div key={judge._id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                <div>
                                    <div className="font-semibold text-white">{judge.name}</div>
                                    <div className="text-xs text-slate-400">{judge.email}</div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRemove(judge._id)}
                                    disabled={loading}
                                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-white mb-4">Available Judges</h2>
                <div className="space-y-3">
                    {availableJudges.length === 0 ? (
                        <p className="text-slate-400">No available judges found. Create "Judge" users in User Management.</p>
                    ) : (
                        availableJudges.map(judge => (
                            <div key={judge._id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                <div>
                                    <div className="font-semibold text-white">{judge.name}</div>
                                    <div className="text-xs text-slate-400">{judge.email}</div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleAdd(judge._id)}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-500"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
