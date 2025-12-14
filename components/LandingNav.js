"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { logout } from '@/actions/auth-actions';

export default function LandingNav({ session }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="relative z-50 border-b border-white/5 backdrop-blur-xl">
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-2xl font-extrabold text-transparent">
                            CompManager
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-3">
                        {session ? (
                            <>
                                <Link
                                    href={session.user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                    className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                </Link>
                                <form action={logout}>
                                    <button
                                        type="submit"
                                        className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" /> Logout
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-white/70 hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="mt-4 flex flex-col gap-3 md:hidden animate-enter">
                        {session ? (
                            <>
                                <Link
                                    href={session.user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                    className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                </Link>
                                <form action={logout} className="w-full">
                                    <button
                                        type="submit"
                                        className="w-full flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" /> Logout
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
