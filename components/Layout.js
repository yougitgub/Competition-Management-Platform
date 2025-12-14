import React from 'react';
import Nav from './Nav';

export default function Layout({ children }) {
  return (
    <>
      <div className="mesh-bg" />
      <div className="mesh-blob mesh-blob-1" />
      <div className="mesh-blob mesh-blob-2" />
      <div className="mesh-blob mesh-blob-3" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Nav />
        <main className="container mx-auto px-6 flex-grow">
          {children}
        </main>
        <footer className="text-center py-6 text-sm text-slate-400 glass border-t-0 border-b-0 border-x-0 !bg-transparent">
          © School Competitions
        </footer>
      </div>
    </>
  );
}
