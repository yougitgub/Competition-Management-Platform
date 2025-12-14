'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function createUser(prevState, formData) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');
    const studentId = formData.get('studentId'); // Optional

    try {
        await dbConnect();
        const existing = await User.findOne({ email });
        if (existing) return { error: 'User already exists' };

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            studentId,
        });

        revalidatePath('/dashboard/users');
        return { success: 'User created' };
    } catch (error) {
        return { error: 'Failed to create user' };
    }
}

export async function getUsers() {
    try {
        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(users));
    } catch (e) {
        return [];
    }
}

export async function updateUserRole(userId, newRole) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    try {
        await dbConnect();
        await User.findByIdAndUpdate(userId, { role: newRole });
        revalidatePath('/dashboard/users');
        return { success: 'Role updated' };
    } catch (error) {
        console.error('updateUserRole error:', error.message);
        return { error: 'Failed to update user' };
    }
}


