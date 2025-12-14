'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function authenticate(prevState, formData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function register(prevState, formData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    try {
        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'student', // Default role
        });

    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Failed to create user" };
    }

    // Attempt to sign in directly after registration
    try {
        await signIn('credentials', { email, password, redirect: false });
    } catch (err) {
        // separate try/catch for signin to avoid masking generic error
        // if we can't auto login, just redirect to login page? 
        // For now, let's just return success message or let redirect happen if signIn worked (but redirect:false...)
    }

    // Re-run signIn with redirect true to finish
    try {
        await signIn('credentials', { email, password });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Created user but failed to auto-login." };
        }
        throw error; // Redirect
    }
}

export async function logout() {
    await signOut();
}
