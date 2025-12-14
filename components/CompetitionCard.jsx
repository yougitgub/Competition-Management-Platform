'use client';
import React from 'react';
import Link from 'next/link';
import { Calendar, Users, ArrowRight } from 'lucide-react';

export default function CompetitionCard({ comp }) {
  // Handle flexible ID reference since we moved to MongoDB (_id)
  const id = comp._id || comp.id;
  const startDate = comp.startDate ? new Date(comp.startDate).toISOString().split('T')[0] : comp.start_date;
  const endDate = comp.endDate ? new Date(comp.endDate).toISOString().split('T')[0] : comp.end_date;

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative p-6 flex flex-col h-full">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <span className="mb-2 inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20">
              {comp.type || 'Competition'}
            </span>
            <Link href={`/competitions/${id}`} className="block mt-2">
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                {comp.title}
              </h3>
            </Link>
          </div>
        </div>

        <p className="mb-6 flex-grow text-sm leading-relaxed text-slate-400 line-clamp-3">
          {comp.description}
        </p>

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{startDate} {endDate ? `- ${endDate}` : ''}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{comp.maxParticipants || comp.max_participants || 'Unlimited'}</span>
            </div>
          </div>

          <Link
            href={`/competitions/${id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
