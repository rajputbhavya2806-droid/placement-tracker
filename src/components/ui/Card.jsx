import React from 'react';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-card transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 ${
        hover ? 'hover:-translate-y-0.5 hover:shadow-card-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800/80 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-slate-900 dark:text-slate-100 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`mt-0.5 text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

