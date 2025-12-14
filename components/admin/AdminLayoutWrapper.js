'use client';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';

export default function AdminLayoutWrapper({ children }) {
    const pathname = usePathname();
    // Don't show sidebar on login page
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
        return <main className="min-h-screen bg-slate-950 text-white animate-enter">{children}</main>;
    }

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-950">
            <div className="w-full flex-none md:w-64">
                <AdminSidebar />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12 text-gray-100">
                <div className="max-w-7xl mx-auto w-full animate-enter">
                    {children}
                </div>
            </div>
        </div>
    );
}
