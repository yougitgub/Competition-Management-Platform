'use client';

import { updateCompetition, getCompetitionById } from '@/actions/competition-actions';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { use, useState, useEffect, useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} className="w-full bg-blue-600 hover:bg-blue-500">
            {pending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
        </Button>
    );
}

export default function EditCompetitionPage({ params }) {
    const { id } = use(params);
    const [state, formAction] = useActionState(updateCompetition.bind(null, id), undefined);
    const [comp, setComp] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCompetitionById(id).then(data => {
            if (data) {
                // Ensure dates are formatted for input type="date"
                if (data.startDate) data.startDate = new Date(data.startDate).toISOString().split('T')[0];
                if (data.endDate) data.endDate = new Date(data.endDate).toISOString().split('T')[0];
                setComp(data);
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
    if (!comp) return <div className="p-8 text-center text-white">Competition not found</div>;

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Edit Competition</h1>

            <div className="glass-panel p-8">
                <form action={formAction} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                            <input
                                name="title"
                                type="text"
                                defaultValue={comp.title}
                                required
                                className="glass-input text-white w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                            <input
                                name="category"
                                type="text"
                                defaultValue={comp.category}
                                required
                                className="glass-input text-white w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Competition Type</label>
                        <select
                            name="type"
                            defaultValue={comp.type}
                            className="glass-input text-white w-full"
                        >
                            <option value="individual">Individual</option>
                            <option value="team">Team</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            defaultValue={comp.description}
                            required
                            className="glass-input text-white w-full"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                            <input
                                name="startDate"
                                type="date"
                                defaultValue={comp.startDate}
                                required
                                className="glass-input text-white w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                            <input
                                name="endDate"
                                type="date"
                                defaultValue={comp.endDate}
                                required
                                className="glass-input text-white w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                        <input
                            name="location"
                            type="text"
                            defaultValue={comp.location}
                            className="glass-input text-white w-full"
                        />
                    </div>

                    {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
                    {state?.success && <p className="text-green-400 text-sm">{state.success}</p>}

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}
