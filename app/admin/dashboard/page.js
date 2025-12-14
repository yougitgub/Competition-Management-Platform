import React from 'react';
import Link from 'next/link';
import { Trophy, Users, FileText, Award, Settings, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const cards = [
    { title: "Manage Competitions", href: "/admin/competitions", icon: Trophy, color: "from-purple-500 to-indigo-500" },
    { title: "Manage Registrations", href: "/admin/registrations", icon: FileText, color: "from-blue-500 to-cyan-500" },
    { title: "Manage Results", href: "/admin/results", icon: Award, color: "from-emerald-500 to-teal-500" },
    { title: "Manage Users", href: "/dashboard/users", icon: Users, color: "from-rose-500 to-pink-500" },
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-600 rounded-xl shadow-lg shadow-red-500/20">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400">Control panel for platform management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className={`p-8 rounded-2xl glass-panel group hover:bg-white/10 relative overflow-hidden animate-enter border border-white/5 transition-all hover:scale-[1.02]`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-500`}></div>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{card.title}</h3>
              <p className="text-sm text-slate-400 relative z-10">Access and modify {card.title.toLowerCase().replace('manage ', '')}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
