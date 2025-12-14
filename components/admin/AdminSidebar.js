'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
    LayoutDashboard,
    Trophy,
    Users,
    ClipboardList,
    Award,
    Settings,
    LogOut
} from 'lucide-react';
import { logout } from '@/actions/auth-actions';

const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Competitions', href: '/admin/competitions', icon: Trophy },
    { name: 'Teams', href: '/admin/teams', icon: Users },
    { name: 'Registrations', href: '/admin/registrations', icon: ClipboardList },
    { name: 'Results', href: '/admin/results', icon: Award },
    { name: 'Users', href: '/admin/users', icon: Users },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-slate-900 border-r border-slate-800">
            <Link
                className="mb-6 flex h-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 p-4 shadow-lg shadow-purple-500/20"
                href="/admin/dashboard"
            >
                <div className="flex items-center gap-2 text-white">
                    <Trophy className="w-6 h-6" />
                    <h1 className="text-xl font-bold tracking-tight">Admin</h1>
                </div>
            </Link>

            <div className="flex grow flex-col space-y-2">
                <div className="space-y-1 w-full">
                    {links.map((link) => {
                        const LinkIcon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={clsx(
                                    'flex h-[48px] items-center gap-3 rounded-xl p-3 px-4 text-sm font-medium transition-all duration-300',
                                    {
                                        'bg-purple-600 text-white shadow-lg shadow-purple-500/25': isActive,
                                        'text-slate-400 hover:bg-white/5 hover:text-white': !isActive,
                                    },
                                )}
                            >
                                <LinkIcon className="w-5 h-5" />
                                <p>{link.name}</p>
                            </Link>
                        );
                    })}
                </div>

                <div className="grow"></div>

                <form action={logout}>
                    <button className="flex h-[48px] w-full items-center gap-3 rounded-xl p-3 px-4 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <div>Sign Out</div>
                    </button>
                </form>
            </div>
        </div>
    );
}
