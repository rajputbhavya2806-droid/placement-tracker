import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';

const TOAST_STYLES = {
  success: {
    container: 'border-emerald-200 bg-white text-slate-800 dark:border-emerald-800/80 dark:bg-slate-900 dark:text-slate-100',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    container: 'border-rose-200 bg-white text-slate-800 dark:border-rose-800/80 dark:bg-slate-900 dark:text-slate-100',
    icon: AlertCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  info: {
    container: 'border-indigo-200 bg-white text-slate-800 dark:border-indigo-800/80 dark:bg-slate-900 dark:text-slate-100',
    icon: Info,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
};

export function ToastContainer() {
  const { toasts, dismissToast } = usePlacement();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex max-w-sm flex-col gap-2.5">
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.success;
        const Icon = style.icon;
        return (
          <div
            key={toast.id}
            role="status"
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg animate-slide-in ${style.container}`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${style.iconColor}`} />
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="ml-auto rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

