import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
        <Compass className="h-8 w-8" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        Error 404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        The placement page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button icon={ArrowLeft}>Back to Dashboard</Button>
      </Link>
    </div>
  );
}

