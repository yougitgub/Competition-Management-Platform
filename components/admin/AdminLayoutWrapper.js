'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { Menu, X } from 'lucide-react';

export default function AdminLayoutWrapper({ children }) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Don't show sidebar on login page
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
        return <main className="min-h-screen bg-slate-950 text-white animate-enter">{children}</main>;
    }

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-950 relative">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 z-30">
                <div className="font-bold text-white flex items-center gap-2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Admin Panel</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar with Drawer functionality on mobile */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <AdminSidebar />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Content Area */}
            <div className="flex-grow p-4 md:p-12 overflow-y-auto text-gray-100 w-full">
                <div className="max-w-7xl mx-auto w-full animate-enter">
                    {children}
                </div>
            </div>
        </div>
    );
}

