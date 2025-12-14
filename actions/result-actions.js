'use server';

import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import Registration from '@/models/Registration';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

import Competition from '@/models/Competition';

export async function submitScore(competitionId, participantId, score, position, type) {
    const session = await auth();
    if (!session) return { error: 'Unauthorized' };

    await dbConnect();

    // Check permissions
    if (session.user.role !== 'admin') {
        if (session.user.role !== 'judge') return { error: 'Unauthorized' };

        // Verify assignment
        const competition = await Competition.findById(competitionId);
        if (!competition.judges.includes(session.user.id)) {
            return { error: 'You are not assigned to judge this competition' };
        }
    }

    try {
        // Check filtering
        const query = { competition: competitionId };
        if (type === 'team') query.team = participantId;
        else query.user = participantId;

        // Upsert result
        // published is strictly FALSE on submission. Must be explicitly published by Admin.
        await Result.findOneAndUpdate(query, {
            competition: competitionId,
            [type]: participantId, // user or team
            score: Number(score),
            position: Number(position),
            published: false
        }, { upsert: true, new: true });

        revalidatePath(`/dashboard/results/${competitionId}`);
        return { success: 'Score saved' };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to save score' };
    }
}

export async function publishResults(competitionId) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') return { error: 'Unauthorized' };

    try {
        await dbConnect();
        await Result.updateMany(
            { competition: competitionId },
            { $set: { published: true } }
        );
        revalidatePath(`/dashboard/results/${competitionId}`);
        return { success: 'Results published successfully' };
    } catch (e) {
        return { error: 'Failed to publish results' };
    }
}

export async function getResults(competitionId) {
    const session = await auth();
    try {
        await dbConnect();

        const query = { competition: competitionId };

        // If not admin, only show published results
        if (!session || session.user.role !== 'admin') {
            query.published = true;
        }

        const results = await Result.find(query)
            .populate('user', 'name email')
            .populate('team', 'name')
            .sort({ position: 1, score: -1 });
        return JSON.parse(JSON.stringify(results));
    } catch (e) {
        return [];
    }
}

export async function getParticipantsForScoring(competitionId) {
    try {
        await dbConnect();
        // Get approved registrations
        const regs = await Registration.find({ competition: competitionId, status: 'approved' })
            .populate('user', 'name email')
            .populate('team', 'name');
        return JSON.parse(JSON.stringify(regs));
    } catch (e) {
        return [];
    }
}

export async function getUserCertificates() {
    const session = await auth();
    if (!session) return [];
    try {
        await dbConnect();
        // Find results where user is associated
        // For individual: user matching
        // For team: find teams user is in, then find results for those teams

        const individualResults = await Result.find({ user: session.user.id })
            .populate('competition', 'title endDate');

        // Logic for team certificates is more complex, keeping simple for now or needing aggregation
        // Assuming individual first for prototype

        return JSON.parse(JSON.stringify(individualResults));
    } catch (e) {
        return [];
    }
}

export async function getCompetitionsStats() {
    const session = await auth();
    if (!session || session.user.role !== 'admin') return [];

    try {
        await dbConnect();

        // Fetch all competitions
        const competitions = await Competition.find({}).sort({ startDate: -1 });

        // Enhance with stats
        const stats = await Promise.all(competitions.map(async (comp) => {
            const totalResults = await Result.countDocuments({ competition: comp._id });
            const publishedResults = await Result.countDocuments({ competition: comp._id, published: true });
            const participantCount = await Registration.countDocuments({ competition: comp._id, status: 'approved' });

            return {
                ...comp.toObject(),
                _id: comp._id.toString(),
                totalResults,
                publishedResults,
                participantCount,
                isPublished: totalResults > 0 && totalResults === publishedResults // Simple check
            };
        }));

        return JSON.parse(JSON.stringify(stats));
    } catch (e) {
        console.error(e);
        return [];
    }
}
