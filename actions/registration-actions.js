'use server';

import dbConnect from '@/lib/db';
import Registration from '@/models/Registration';
import Competition from '@/models/Competition';
import Team from '@/models/Team';
import User from '@/models/User';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getRegistrations() {
    const session = await auth();
    if (!session || session.user.role !== 'admin') return [];

    try {
        await dbConnect();
        const regs = await Registration.find({})
            .populate('user', 'name email')
            .populate('competition', 'title type')
            .populate('team', 'name')
            .sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(regs));
    } catch (e) {
        return [];
    }
}

export async function getCompetitionRegistrations(competitionId) {
    try {
        await dbConnect();
        const regs = await Registration.find({ competition: competitionId })
            .populate('user', 'name email')
            .populate('team', 'name')
            .sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(regs));
    } catch (e) {
        return [];
    }
}

export async function updateRegistrationStatus(id, status) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') return { error: 'Unauthorized' };

    try {
        await dbConnect();
        await Registration.findByIdAndUpdate(id, { status });
        revalidatePath('/dashboard/registrations');
        return { success: `Registration ${status}` };
    } catch (e) {
        return { error: 'Failed to update status' };
    }
}

export async function deleteRegistration(id) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') return { error: 'Unauthorized' };

    try {
        await dbConnect();
        await Registration.findByIdAndDelete(id);
        revalidatePath('/dashboard/registrations');
        return { success: 'Registration deleted' };
    } catch (e) {
        return { error: 'Failed to delete registration' };
    }
}
