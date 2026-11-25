import { APPLICATION_STATUSES, STATUS_STYLES } from './constants';

const SHORTLISTED_STATUSES = new Set([
  'Online Assessment',
  'Technical Interview',
  'HR Interview',
  'Selected',
]);

const INTERVIEW_STAGE_STATUSES = new Set([
  'Technical Interview',
  'HR Interview',
  'Selected',
]);

export function computeDashboardMetrics(companies = [], applications = [], interviews = []) {
  const totalCompanies = companies.length;
  const totalApplications = applications.length;
  const shortlistedApplications = applications.filter((app) =>
    SHORTLISTED_STATUSES.has(app.status)
  ).length;

  const upcomingInterviews = interviews.filter((iv) => !iv.completed).length;
  const offersReceived = applications.filter((app) => app.status === 'Selected').length;

  const decidedApplications = applications.filter(
    (app) => app.status === 'Selected' || app.status === 'Rejected'
  ).length;
  const successBase = decidedApplications > 0 ? decidedApplications : totalApplications;
  const placementSuccessRate =
    successBase > 0 ? Math.round((offersReceived / totalApplications) * 100) : 0;

  const interviewStageApps = applications.filter((app) =>
    INTERVIEW_STAGE_STATUSES.has(app.status)
  ).length;

  const appToInterviewRate =
    totalApplications > 0 ? Math.round((interviewStageApps / totalApplications) * 100) : 0;

  const interviewToSelectionRate =
    interviewStageApps > 0 ? Math.round((offersReceived / interviewStageApps) * 100) : 0;

  return {
    totalCompanies,
    totalApplications,
    shortlistedApplications,
    interviewsScheduled: upcomingInterviews,
    totalInterviews: interviews.length,
    offersReceived,
    placementSuccessRate,
    appToInterviewRate,
    interviewToSelectionRate,
  };
}

export function getStatusDistribution(applications = []) {
  const counts = {};
  for (const status of APPLICATION_STATUSES) {
    counts[status] = 0;
  }
  for (const app of applications) {
    counts[app.status] = (counts[app.status] || 0) + 1;
  }
  return APPLICATION_STATUSES.map((status) => ({
    name: status,
    value: counts[status] || 0,
    color: STATUS_STYLES[status]?.chartColor || '#6366F1',
  })).filter((entry) => entry.value > 0);
}

export function getMonthlyApplicationTrends(applications = []) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const buckets = new Map();

  // Seed recent 6 months relative to latest application or Nov 2026 so chart always looks balanced
  const baseMonths = [
    { key: '2026-07', label: 'Jul 26' },
    { key: '2026-08', label: 'Aug 26' },
    { key: '2026-09', label: 'Sep 26' },
    { key: '2026-10', label: 'Oct 26' },
    { key: '2026-11', label: 'Nov 26' },
    { key: '2026-12', label: 'Dec 26' },
  ];

  for (const m of baseMonths) {
    buckets.set(m.key, { month: m.label, applications: 0, shortlisted: 0, offers: 0 });
  }

  for (const app of applications) {
    if (!app.appliedDate) continue;
    const d = new Date(app.appliedDate);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
    if (!buckets.has(key)) {
      buckets.set(key, { month: label, applications: 0, shortlisted: 0, offers: 0 });
    }
    const entry = buckets.get(key);
    entry.applications += 1;
    if (SHORTLISTED_STATUSES.has(app.status)) {
      entry.shortlisted += 1;
    }
    if (app.status === 'Selected') {
      entry.offers += 1;
    }
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, val]) => val);
}

export function getCompanyWiseStats(companies = [], applications = []) {
  const appCounts = new Map();
  for (const app of applications) {
    const key = app.companyName.trim();
    const existing = appCounts.get(key) || {
      company: key,
      applications: 0,
      packageLPA: Number(app.packageLPA) || 0,
    };
    existing.applications += 1;
    existing.packageLPA = Math.max(existing.packageLPA, Number(app.packageLPA) || 0);
    appCounts.set(key, existing);
  }

  for (const company of companies) {
    if (!appCounts.has(company.name)) {
      appCounts.set(company.name, {
        company: company.name,
        applications: 0,
        packageLPA: Number(company.packageLPA) || 0,
      });
    } else {
      const existing = appCounts.get(company.name);
      existing.packageLPA = Math.max(existing.packageLPA, Number(company.packageLPA) || 0);
    }
  }

  return Array.from(appCounts.values()).sort(
    (a, b) => b.applications - a.applications || b.packageLPA - a.packageLPA
  );
}

