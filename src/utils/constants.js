export const APPLICATION_STATUSES = [
  'Interested',
  'Applied',
  'Online Assessment',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Rejected',
];

export const STATUS_STYLES = {
  Interested: {
    badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    dot: 'bg-slate-500',
    chartColor: '#64748B',
  },
  Applied: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    dot: 'bg-blue-500',
    chartColor: '#3B82F6',
  },
  'Online Assessment': {
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    dot: 'bg-amber-500',
    chartColor: '#F59E0B',
  },
  'Technical Interview': {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    dot: 'bg-indigo-500',
    chartColor: '#6366F1',
  },
  'HR Interview': {
    badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    dot: 'bg-purple-500',
    chartColor: '#A855F7',
  },
  Selected: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    chartColor: '#10B981',
  },
  Rejected: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    dot: 'bg-rose-500',
    chartColor: '#F43F5E',
  },
  'Not Applied': {
    badge: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    dot: 'bg-gray-400',
    chartColor: '#94A3B8',
  },
};

export const PREP_CATEGORIES = [
  'Data Structures and Algorithms',
  'Aptitude',
  'Core Subjects (DBMS, OS, CN, OOPs)',
  'Programming Languages',
  'Projects',
  'Resume Preparation',
];

export const INDUSTRIES = [
  'Product & Cloud Tech',
  'E-Commerce & Cloud',
  'IT Services & Consulting',
  'Consulting & Advisory',
  'E-Commerce & Fintech',
  'Enterprise Software',
  'FinTech',
];

export const PACKAGE_FILTERS = [
  { label: 'All Packages', value: 'all' },
  { label: 'Under 8 LPA', value: 'under-8' },
  { label: '8 - 18 LPA', value: '8-18' },
  { label: '18 - 30 LPA', value: '18-30' },
  { label: '30+ LPA', value: '30-plus' },
];

export const INTERVIEW_TYPES = ['Online', 'Offline'];

export const INTERVIEW_ROUNDS = [
  'Online Assessment Debrief',
  'Technical Round 1',
  'Technical Round 2',
  'System Design Round',
  'Hiring Manager Round',
  'HR Interview',
];

