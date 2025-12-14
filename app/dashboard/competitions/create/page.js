'use client';

import { createCompetition } from '@/actions/competition-actions';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { useState, useActionState } from 'react';
import { Plus, Trash } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} className="w-full bg-blue-600 hover:bg-blue-500">
            {pending ? 'Creating...' : 'Create Competition'}
        </Button>
    );
}

function RulesInput() {
    const [rules, setRules] = useState(['']);

    const addRule = () => setRules([...rules, '']);
    const removeRule = (index) => setRules(rules.filter((_, i) => i !== index));
    const updateRule = (index, value) => {
        const newRules = [...rules];
        newRules[index] = value;
        setRules(newRules);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">Rules & Guidelines</label>
            {rules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        name="rules"
                        value={rule}
                        onChange={(e) => updateRule(index, e.target.value)}
                        className="glass-input text-white w-full"
                        placeholder={`Rule #${index + 1}`}
                    />
                    {rules.length > 1 && (
                        <Button type="button" onClick={() => removeRule(index)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20">
                            <Trash className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addRule}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
                <Plus className="w-4 h-4" /> Add Another Rule
            </button>
        </div>
    );
}

export default function CreateCompetitionPage() {
    const [state, formAction] = useActionState(createCompetition, undefined);
    const [type, setType] = useState('individual');

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Create New Competition</h1>

            <div className="glass-panel p-8">
                <form action={formAction} className="space-y-6">
                    {state?.error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {state.error}
                        </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                            <input
                                name="title"
                                type="text"
                                required
                                className="glass-input text-white w-full"
                                placeholder="Annual Science Fair"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                            <input
                                name="category"
                                type="text"
                                required
                                className="glass-input text-white w-full"
                                placeholder="Science, Sports, Arts, etc."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Competition Type</label>
                        <select
                            name="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="glass-input text-white w-full"
                        >
                            <option value="individual">Individual</option>
                            <option value="team">Team Only</option>
                            <option value="mixed">Mixed (Individuals & Teams)</option>
                        </select>
                        <p className="text-xs text-slate-400 mt-1">
                            {type === 'team'
                                ? 'Only team leaders can register their teams'
                                : type === 'mixed'
                                    ? 'Both individuals and teams can register'
                                    : 'Each student registers individually'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            required
                            className="glass-input text-white w-full"
                            placeholder="Detailed description of the competition..."
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                            <input
                                name="startDate"
                                type="date"
                                required
                                className="glass-input text-white w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                            <input
                                name="endDate"
                                type="date"
                                required
                                className="glass-input text-white w-full"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                            <input
                                name="location"
                                type="text"
                                className="glass-input text-white w-full"
                                placeholder="Main Hall"
                                defaultValue="Main Hall"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Max Participants (Optional)</label>
                            <input
                                name="maxParticipants"
                                type="number"
                                className="glass-input text-white w-full"
                                placeholder="Leave empty for unlimited"
                            />
                        </div>
                    </div>

                    <RulesInput />

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}
