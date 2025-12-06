'use client';
import React, { useState, useEffect } from 'react';

export default function Nav() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Scroll effect handler
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-6'}`}>
      <div className={`container mx-auto px-6 transition-all duration-300 ${scrolled ? 'max-w-7xl' : ''}`}>
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl backdrop-blur-md bg-white/5 border border-white/10">
          <a href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            School Competitions
          </a>

          <div className="flex items-center gap-6">
            <a href="/competitions" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
              Competitions
            </a>
            <a href="/results" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
              Results
            </a>

            {!loading && (
              <>
                {!user ? (
                  <>
                    <a href="/login" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                      Login
                    </a>
                    <a href="/admin/login" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                      Admin
                    </a>
                  </>
                ) : (
                  <>
                    {user.role === 'admin' ? (
                      <a href="/admin/dashboard" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                        Admin Dashboard
                      </a>
                    ) : (
                      <a href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                        Dashboard
                      </a>
                    )}
                    <button
                      onClick={logout}
                      className="text-sm font-medium px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
