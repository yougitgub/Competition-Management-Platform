'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl backdrop-blur-md bg-white/5 border border-white/10 relative">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            School Competitions
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/competitions" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
              Competitions
            </Link>
            <Link href="/results" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
              Results
            </Link>

            {!loading && (
              <>
                {!user ? (
                  <>
                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                      Login
                    </Link>
                    <Link href="/admin/login" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                      Admin
                    </Link>
                  </>
                ) : (
                  <>
                    {user.role === 'admin' ? (
                      <Link href="/admin/dashboard" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                        Dashboard
                      </Link>
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
          <div className="mt-2 p-4 rounded-2xl glass border border-white/10 bg-slate-900/90 backdrop-blur-xl md:hidden animate-enter">
            <div className="flex flex-col gap-4">
              <Link href="/competitions" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Competitions
              </Link>
              <Link href="/results" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Results
              </Link>
              {!loading && (
                <>
                  {!user ? (
                    <>
                      <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                        Login
                      </Link>
                      <Link href="/admin/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                        Admin
                      </Link>
                    </>
                  ) : (
                    <>
                      {user.role === 'admin' ? (
                        <Link href="/admin/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                          Admin Dashboard
                        </Link>
                      ) : (
                        <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="text-sm font-medium text-left text-red-400 hover:text-red-300 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
