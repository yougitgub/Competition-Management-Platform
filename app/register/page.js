'use client';

import { useActionState } from 'react';
import { register } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, Sparkles } from 'lucide-react';

export default function RegisterPage() {
    const [state, dispatch, isPending] = useActionState(register, undefined);

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950" />

                {/* Animated orbs */}
                <div className="absolute top-0 -right-4 h-72 w-72 animate-pulse rounded-full bg-blue-500/30 blur-3xl" />
                <div className="absolute bottom-0 -left-4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-pink-500/20 blur-3xl animation-delay-4000" />
            </div>

            {/* Register Card */}
            <div className="relative w-full max-w-md animate-enter">
                {/* Glow effect */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-xl" />

                {/* Glass card */}
                <div className="relative space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Header with icon */}
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-blue-500/50">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                            Join Us Today
                        </h2>
                        <p className="mt-3 text-sm text-gray-300">
                            Create your account and start competing
                        </p>
                    </div>

                    <form action={dispatch} className="space-y-5">
                        <div className="space-y-4">
                            {/* Name Input */}
                            <div className="group">
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-200">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <User className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-purple-400" />
                                    </div>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        placeholder="John Doe"
                                        className="w-full rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:bg-white/10"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="group">
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-200">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Mail className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-purple-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        placeholder="m@example.com"
                                        className="w-full rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:bg-white/10"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="group">
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-200">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-purple-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength={6}
                                        className="w-full rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:bg-white/10"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="group">
                                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-200">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Lock className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-purple-400" />
                                    </div>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength={6}
                                        className="w-full rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:bg-white/10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {state?.error && (
                            <div className="animate-enter rounded-xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-sm">
                                <p className="text-sm text-red-300">{state.error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            aria-disabled={isPending}
                            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 py-6 text-base font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isPending ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-5 w-5" />
                                        Sign up
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-700 via-blue-700 to-pink-700 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Button>

                        {/* Sign in link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-400">
                                Already have an account?{' '}
                                <Link
                                    href="/login"
                                    className="font-semibold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text hover:from-purple-300 hover:to-blue-300 transition-all"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
