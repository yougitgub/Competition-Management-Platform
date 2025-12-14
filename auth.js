import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import dbConnect from './lib/db';
import User from './models/User';
import bcrypt from 'bcryptjs';

async function getUser(email) {
    try {
        await dbConnect();
        const user = await User.findOne({ email }).select('+password').lean();
        if (user) {
            user._id = user._id.toString();
        }
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    // Allow login if user has no password set (e.g. initial setup) or verify hash
                    // Note: In production, you'd force password setup.
                    // For now, if user exists but has no password (if that's possible in manual creation), logic might differ.
                    // But our User model makes password select:false, so we explicitly selected it.
                    // If password is undefined in DB, this might fail comparison.
                    if (!user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
