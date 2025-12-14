'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
    LayoutDashboard,
    Trophy,
    Users,
    LogOut,
    Settings,
    ClipboardList,
    Award
} from 'lucide-react';
import { logout } from '@/actions/auth-actions';

const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Competitions', href: '/dashboard/competitions', icon: Trophy },
    { name: 'Teams', href: '/dashboard/teams', icon: Users },
    { name: 'Results', href: '/dashboard/results', icon: Award },
];

// We might filter links based on role prop later

export function Sidebar({ user }) {
    const pathname = usePathname();

    // clone links to avoid mutating global
    const displayLinks = links.map(link => {
        if (link.name === 'Results' && user?.role === 'admin') {
            return { ...link, href: '/admin/results' };
        }
        return link;
    });

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-slate-900 border-r border-slate-800">
            <Link
                className="mb-6 flex h-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 shadow-lg shadow-blue-500/20"
                href="/"
            >
                <div className="flex items-center gap-2 text-white">
                    <Trophy className="w-6 h-6" />
                    <h1 className="text-xl font-bold tracking-tight">CompManager</h1>
                </div>
            </Link>

            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <div className="space-y-1 w-full">
                    {displayLinks.map((link) => {
                        const LinkIcon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    'flex h-[48px] grow items-center justify-center gap-3 rounded-xl p-3 text-sm font-medium transition-all duration-300 md:flex-none md:justify-start md:p-3 md:px-4',
                                    {
                                        'bg-blue-600 text-white shadow-lg shadow-blue-500/25': isActive,
                                        'text-slate-400 hover:bg-white/5 hover:text-white': !isActive,
                                    },
                                )}
                            >
                                <LinkIcon className="w-5 h-5" />
                                <p className="hidden md:block">{link.name}</p>
                            </Link>
                        );
                    })}

                    {user?.role === 'admin' && (
                        <Link
                            href="/dashboard/users"
                            className={clsx(
                                'flex h-[48px] grow items-center justify-center gap-3 rounded-xl p-3 text-sm font-medium transition-all duration-300 md:flex-none md:justify-start md:p-3 md:px-4',
                                {
                                    'bg-blue-600 text-white shadow-lg shadow-blue-500/25': pathname === '/dashboard/users',
                                    'text-slate-400 hover:bg-white/5 hover:text-white': pathname !== '/dashboard/users',
                                },
                            )}
                        >
                            <Settings className="w-5 h-5" />
                            <p className="hidden md:block">Users</p>
                        </Link>
                    )}
                </div>

                <div className="hidden h-auto w-full grow md:block"></div>

                <form action={logout}>
                    <button className="flex h-[48px] w-full grow items-center justify-center gap-3 rounded-xl p-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors md:flex-none md:justify-start md:p-3 md:px-4">
                        <LogOut className="w-5 h-5" />
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                </form>
            </div>
        </div>
    );
}
