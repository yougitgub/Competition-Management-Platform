'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Trophy, Users, Medal, Sparkles } from 'lucide-react';

export default function Nav() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
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

  const navLinks = user ? (
    user.role === 'admin' ? [
      { href: '/competitions', label: 'Competitions', icon: Trophy },
      { href: '/results', label: 'Results', icon: Medal },
      { href: '/admin/dashboard', label: 'Admin Panel', icon: Sparkles, highlight: true },
    ] : [
      { href: '/competitions', label: 'Competitions', icon: Trophy },
      { href: '/dashboard/teams', label: 'Teams', icon: Users },
      { href: '/results', label: 'Results', icon: Medal },
      { href: '/dashboard', label: 'Dashboard', highlight: true },
    ]
  ) : [
    { href: '/competitions', label: 'Competitions', icon: Trophy },
    { href: '/results', label: 'Results', icon: Medal },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-slate-900/90 backdrop-blur-2xl shadow-2xl shadow-black/20'
        : 'bg-slate-900/70 backdrop-blur-xl'
      }`}>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Logo container */}
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight leading-none mb-0.5">
                  School Competitions
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Excellence Platform
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${link.highlight
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105'
                      : 'text-slate-300 hover:text-white'
                    }`}
                >
                  {!link.highlight && (
                    <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  {LinkIcon && <LinkIcon className="w-4 h-4 relative z-10" />}
                  <span className="relative z-10">{link.label}</span>
                  {!link.highlight && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-3/4 transition-all duration-300" />
                  )}
                </Link>
              );
            })}

            {!loading && (
              <div className="ml-2 pl-3 border-l border-white/10 flex items-center gap-2">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      className="group relative px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Login</span>
                    </Link>
                    <Link
                      href="/admin/login"
                      className="relative px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/15 transition-all border border-white/10 hover:border-white/20 hover:scale-105 duration-300"
                    >
                      Admin
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={logout}
                    className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 text-sm font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 rounded-xl transition-colors duration-300" />
                    <span className="relative z-10">Logout</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-all duration-300 active:scale-95"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-2xl animate-enter">
          <div className="container mx-auto px-6 py-6 space-y-2">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${link.highlight
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
                    }`}
                >
                  {LinkIcon && <LinkIcon className="w-5 h-5" />}
                  {link.label}
                </Link>
              );
            })}

            {!loading && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      href="/admin/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/15 transition-all"
                    >
                      Admin Access
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all text-left"
                  >
                    Logout
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
