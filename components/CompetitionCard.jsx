'use client';
import React from 'react';

export default function CompetitionCard({ comp }) {
  return (
    <div className="p-6 glass-panel hover:-translate-y-2 transform transition-all duration-300 shadow-lg group cursor-pointer h-full flex flex-col">
      <a href={`/competitions/${comp.id}`} className="text-xl font-bold block mb-3 text-slate-100 group-hover:text-blue-400 transition-colors">{comp.title}</a>
      <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">{comp.description}</p>
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 border-t border-white/5 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500/50"></span>
          {comp.start_date} — {comp.end_date}
        </div>
        <div className="px-2 py-1 rounded bg-white/5 border border-white/5">Max: {comp.max_participants || '∞'}</div>
      </div>
    </div>
  );
}
