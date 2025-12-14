import React from 'react';
import Nav from './Nav';

export default function Layout({ children }) {
  return (
    <div className="relative z-10 min-h-screen flex flex-col bg-slate-950">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" />

        {/* Animated Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      <Nav />
      <main className="container mx-auto px-6 flex-grow">
        {children}
      </main>
      <footer className="text-center py-6 text-sm text-slate-400 border-t border-white/5 mx-auto w-full max-w-7xl">
        © School Competitions
      </footer>
    </div>
  );
}
