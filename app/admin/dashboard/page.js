import React from 'react';
import Layout from '../../../components/Layout';

export default function AdminDashboard() {
  const cards = [
    { title: "Manage Competitions", href: "/admin/competitions", color: "from-purple-500 to-indigo-500" },
    { title: "Manage Registrations", href: "/admin/registrations", color: "from-blue-500 to-cyan-500" },
    { title: "Manage Results", href: "/admin/results", color: "from-emerald-500 to-teal-500" },
    { title: "Manage Certificates", href: "/admin/certificates", color: "from-amber-500 to-orange-500" },
    { title: "Manage Users", href: "/admin/users", color: "from-rose-500 to-pink-500" },
  ];

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <a
              key={card.title}
              href={card.href}
              className={`p-8 rounded-2xl glass-panel group hover:bg-white/10 relative overflow-hidden animate-enter`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-500`}></div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{card.title}</h3>
              <p className="text-sm text-slate-400">Access and modify {card.title.toLowerCase().replace('manage ', '')}</p>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
}
