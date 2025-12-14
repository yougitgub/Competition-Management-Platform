import Nav from '@/components/Nav';
import { auth } from '@/auth';

export default async function Layout({ children }) {
    const session = await auth();

    return (
        <div className="relative z-10 min-h-screen flex flex-col bg-slate-950">
            {/* Mesh Background for consistency with public pages */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" />
            </div>

            <Nav />
            <main className="container mx-auto px-4 py-8 flex-grow animate-enter">
                {children}
            </main>
            <footer className="text-center py-6 text-sm text-slate-400 border-t border-white/5 mx-auto w-full max-w-7xl">
                © School Competitions
            </footer>
        </div>
    );
}
