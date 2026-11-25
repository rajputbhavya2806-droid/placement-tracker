import React from 'react';

const baseControlClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-400';

export function FormField({ label, error, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
      )}
      {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}

export function Input({ label, error, required, hint, className = '', ...props }) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <input
        className={`${baseControlClass} ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''
        } ${className}`}
        {...props}
      />
    </FormField>
  );
}

export function Select({ label, error, required, hint, children, className = '', ...props }) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <select
        className={`${baseControlClass} ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </select>
    </FormField>
  );
}

export function Textarea({ label, error, required, hint, className = '', rows = 3, ...props }) {
  return (
    <FormField label={label} error={error} required={required} hint={hint}>
      <textarea
        rows={rows}
        className={`${baseControlClass} ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''
        } ${className}`}
        {...props}
      />
    </FormField>
  );
}

