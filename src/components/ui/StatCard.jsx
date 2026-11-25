import React from 'react';
import { Card } from './Card';

export function StatCard({ title, value, subtitle, icon: Icon, trend, accent = 'indigo' }) {
  const accents = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    cyan: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400',
  };

  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accents[accent] || accents.indigo}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="truncate text-slate-500 dark:text-slate-400">{subtitle}</span>
          )}
        </div>
      )}
    </Card>
  );
}

