'use server';

import dbConnect from '@/lib/db';
import Score from '@/models/Score';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function submitScore(prevState, formData) {
    const session = await auth();
    // Ensure user is judge or admin
    if (!session || (session.user.role !== 'judge' && session.user.role !== 'admin')) {
        return { error: 'Unauthorized' };
    }

    const competitionId = formData.get('competitionId');
    const teamId = formData.get('teamId');
    const scoreVal = Number(formData.get('score'));
    const notes = formData.get('notes');

    try {
        await dbConnect();

        // Check if judge already scored this team for this competition
        const existing = await Score.findOne({
            competition: competitionId,
            team: teamId,
            judge: session.user.id
        });

        if (existing) {
            existing.totalScore = scoreVal;
            existing.notes = notes;
            await existing.save();
        } else {
            await Score.create({
                competition: competitionId,
                team: teamId,
                judge: session.user.id,
                totalScore: scoreVal,
                notes,
            });
        }

        revalidatePath(`/dashboard/competitions/${competitionId}`);
        return { success: 'Score submitted' };
    } catch (error) {
        return { error: 'Failed to submit score' };
    }
}

export async function getResults(competitionId) {
    try {
        await dbConnect();
        // Aggregate scores by team
        const scores = await Score.aggregate([
            { $match: { competition: { $eq: new (require('mongoose').Types.ObjectId)(competitionId) } } },
            {
                $group: {
                    _id: "$team",
                    totalScore: { $sum: "$totalScore" },
                    avgScore: { $avg: "$totalScore" }
                }
            },
            { $sort: { totalScore: -1 } },
            { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'team' } },
            { $unwind: '$team' }
        ]);

        return JSON.parse(JSON.stringify(scores));
    } catch (e) {
        console.error(e);
        return [];
    }
}
