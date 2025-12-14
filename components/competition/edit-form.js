'use client';

import { useActionState, useState } from 'react';
import { updateCompetition } from '@/actions/competition-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// We pass the competition data from the server component wrapper
export function EditCompetitionForm({ competition }) {
    const updateWithId = updateCompetition.bind(null, competition._id);
    const [state, dispatch, isPending] = useActionState(updateWithId, undefined);
    // Optional: local state for controlled inputs if needed, or just defaultValues

    return (
        <form action={dispatch} className="space-y-6 bg-gray-50 p-6 rounded-xl dark:bg-gray-800">
            <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input name="title" required defaultValue={competition.title} />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                    name="description"
                    required
                    rows={4}
                    className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                    defaultValue={competition.description}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <div className="relative">
                        <select
                            name="category"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500 bg-white dark:bg-gray-950 dark:border-gray-800"
                            defaultValue={competition.category}
                        >
                            <option value="" disabled>Select a category</option>
                            <option value="Science">Science</option>
                            <option value="Arts">Arts</option>
                            <option value="Sports">Sports</option>
                            <option value="Literature">Literature</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input name="startDate" type="date" required defaultValue={competition.startDate ? new Date(competition.startDate).toISOString().split('T')[0] : ''} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input name="endDate" type="date" required defaultValue={competition.endDate ? new Date(competition.endDate).toISOString().split('T')[0] : ''} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input name="location" defaultValue={competition.location} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Link href={`/dashboard/competitions/${competition._id}`}>
                    <Button type="button" className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" aria-disabled={isPending}>
                    {isPending ? 'Updating...' : 'Update Competition'}
                </Button>
            </div>

            {state?.error && (
                <p className="text-sm text-red-500">{state.error}</p>
            )}
        </form>
    );
}
