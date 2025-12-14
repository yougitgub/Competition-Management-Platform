'use server';

import dbConnect from '@/lib/db';
import Competition from '@/models/Competition';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createCompetition(prevState, formData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const title = formData.get('title');
    const description = formData.get('description');
    const type = formData.get('type'); // 'individual' | 'team'
    const category = formData.get('category');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    const location = formData.get('location');
    const rules = formData.getAll('rules').filter(r => r.trim() !== ''); // Parse multi-input rules

    try {
        await dbConnect();
        const newCompetition = await Competition.create({
            title,
            description,
            type,
            category,
            startDate,
            endDate,
            location,
            rules: rules.length > 0 ? rules : [], // Save as array
        });
        revalidatePath('/dashboard/competitions');
        return { success: 'Competition created successfully!' };
    } catch (error) {
        console.error('createCompetition error:', error.message);
        return { error: 'Failed to create competition.' };
    }
}

export async function getCompetitions() {
    try {
        await dbConnect();
        const competitions = await Competition.find({})
            .sort({ startDate: 1 });
        return JSON.parse(JSON.stringify(competitions));
    } catch (error) {
        console.error('getCompetitions error:', error.message);
        return [];
    }
}

export async function getCompetitionById(id) {
    try {
        await dbConnect();
        const competition = await Competition.findById(id).populate('judges', 'name email');
        return JSON.parse(JSON.stringify(competition));
    } catch (error) {
        return null; // Handle not found gracefully
    }
}

export async function updateCompetition(id, prevState, formData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const title = formData.get('title');
    const description = formData.get('description');
    const type = formData.get('type');
    const category = formData.get('category');
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    const location = formData.get('location');
    const status = formData.get('status');
    const rules = formData.getAll('rules').filter(r => r.trim() !== '');

    try {
        await dbConnect();
        await Competition.findByIdAndUpdate(id, {
            title,
            description,
            type,
            category,
            startDate,
            endDate,
            location,
            status,
            rules
        });
        revalidatePath('/dashboard/competitions');
        revalidatePath(`/dashboard/competitions/${id}`);
        return { success: 'Competition updated' };
    } catch (error) {
        return { error: 'Update failed' };
    }
}

export async function addJudgeToCompetition(competitionId, judgeId) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') return { error: 'Unauthorized' };

    try {
        await dbConnect();
        const competition = await Competition.findById(competitionId);
        if (!competition.judges.includes(judgeId)) {
            competition.judges.push(judgeId);
            await competition.save();
        }
        revalidatePath(`/dashboard/competitions/${competitionId}/judges`);
        return { success: 'Judge added' };
    } catch (e) {
        return { error: 'Failed to add judge' };
    }
}

export async function removeJudgeFromCompetition(competitionId, judgeId) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') return { error: 'Unauthorized' };

    try {
        await dbConnect();
        await Competition.findByIdAndUpdate(competitionId, {
            $pull: { judges: judgeId }
        });
        revalidatePath(`/dashboard/competitions/${competitionId}/judges`);
        return { success: 'Judge removed' };
    } catch (e) {
        return { error: 'Failed to remove judge' };
    }
}

export async function setCompetitionStatus(id, status) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') return { error: 'Unauthorized' };

    try {
        await dbConnect();
        await Competition.findByIdAndUpdate(id, { status });
        revalidatePath('/dashboard/competitions');
        revalidatePath(`/dashboard/competitions/${id}`);
        return { success: 'Status updated' };
    } catch (e) {
        return { error: 'Failed to update status' };
    }
}

export async function deleteCompetition(id) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') return { error: 'Unauthorized' };

    try {
        await dbConnect();
        // Delete related data first if needed (results, registrations?) - cascading usually manually handled or hooks
        // Ideally:
        // await Result.deleteMany({ competition: id });
        // await Registration.deleteMany({ competition: id });
        await Competition.findByIdAndDelete(id);
        revalidatePath('/dashboard/competitions');
        return { success: 'Competition deleted' };
    } catch (e) {
        return { error: 'Failed to delete competition' };
    }
}
