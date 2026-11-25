import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  Video,
  MapPin,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { usePlacement } from '../context/PlacementContext';
import {
  computeDashboardMetrics,
  getMonthlyApplicationTrends,
  getStatusDistribution,
} from '../utils/analytics';
import { formatDate, formatDateTime } from '../utils/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge, Badge } from '../components/ui/Badge';
import { CompanyAvatar } from '../components/ui/CompanyAvatar';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

export function Dashboard() {
  const { companies, applications, interviews, prepTasks, profile } = usePlacement();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 180);
    return () => clearTimeout(timer);
  }, []);

  const metrics = useMemo(
    () => computeDashboardMetrics(companies, applications, interviews),
    [companies, applications, interviews]
  );

  const statusData = useMemo(() => getStatusDistribution(applications), [applications]);
  const monthlyData = useMemo(() => getMonthlyApplicationTrends(applications), [applications]);

  const upcomingInterviews = useMemo(
    () =>
      interviews
        .filter((iv) => !iv.completed)
        .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`))
        .slice(0, 4),
    [interviews]
  );

  const recentApplications = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        .slice(0, 5),
    [applications]
  );

  const topRecruitingCompanies = useMemo(
    () =>
      [...companies]
        .sort((a, b) => Number(b.packageLPA) - Number(a.packageLPA))
        .slice(0, 5),
    [companies]
  );

  const prepPercentage = useMemo(() => {
    if (prepTasks.length === 0) return 0;
    const completed = prepTasks.filter((t) => t.completed).length;
    return Math.round((completed / prepTasks.length) * 100);
  }, [prepTasks]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {profile.name.split(' ')[0]}
            </h1>
            <Badge variant="indigo">Class of {profile.graduationYear}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your campus placement pipeline, upcoming interviews, and preparation readiness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Prep Readiness
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {prepPercentage}%
            </span>
          </div>
          <Link
            to="/applications"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-700"
          >
            Track Application
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 6 Overview KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Companies"
          value={metrics.totalCompanies}
          subtitle="Active campus drives"
          icon={Building2}
          accent="indigo"
        />
        <StatCard
          title="Total Applications"
          value={metrics.totalApplications}
          subtitle="Across all roles"
          icon={Briefcase}
          accent="blue"
        />
        <StatCard
          title="Shortlisted"
          value={metrics.shortlistedApplications}
          subtitle="OA & Interview stages"
          icon={CheckCircle2}
          accent="amber"
        />
        <StatCard
          title="Interviews Scheduled"
          value={metrics.interviewsScheduled}
          subtitle="Upcoming rounds"
          icon={CalendarClock}
          accent="purple"
        />
        <StatCard
          title="Offers Received"
          value={metrics.offersReceived}
          subtitle="Confirmed selections"
          icon={Award}
          accent="emerald"
        />
        <StatCard
          title="Success Rate"
          value={`${metrics.placementSuccessRate}%`}
          subtitle="Offers / Applications"
          icon={TrendingUp}
          accent="cyan"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Application Activity Graph */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Monthly Application Activity</CardTitle>
              <CardDescription>
                Applications submitted vs. shortlisted milestones over recent months
              </CardDescription>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View Analytics
            </Link>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorShortlisted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 10px 25px -5px rgba(15,23,42,0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    name="Applications"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorApps)"
                  />
                  <Area
                    type="monotone"
                    dataKey="shortlisted"
                    name="Shortlisted"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorShortlisted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Application Status Pie Chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Distribution across pipeline stages</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <EmptyState
                title="No application data"
                description="Add your first job application to visualize pipeline distribution."
              />
            ) : (
              <>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #E2E8F0',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {statusData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 truncate text-slate-600 dark:text-slate-300">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="truncate">{entry.name}</span>
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom 3-Column Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Next scheduled rounds</CardDescription>
            </div>
            <Link
              to="/interviews"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              See all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingInterviews.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="No upcoming interviews"
                description="Schedule a new interview round from the Interview Tracker."
              />
            ) : (
              upcomingInterviews.map((iv) => (
                <div
                  key={iv.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-colors hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {iv.companyName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{iv.round}</p>
                    </div>
                    <Badge variant={iv.type === 'Online' ? 'indigo' : 'amber'}>
                      {iv.type === 'Online' ? (
                        <span className="inline-flex items-center gap-1">
                          <Video className="h-3 w-3" /> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Offline
                        </span>
                      )}
                    </Badge>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>{formatDateTime(iv.date, iv.time)}</span>
                    {iv.type === 'Online' && iv.meetingLink && (
                      <a
                        href={iv.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        Join <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Application Activity */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updated job applications</CardDescription>
            </div>
            <Link
              to="/applications"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Manage
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentApplications.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No applications yet"
                description="Start tracking your campus applications."
              />
            ) : (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-800/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {app.companyName}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {app.position} · {formatDate(app.appliedDate)}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Recruiting Companies */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Top Recruiting Companies</CardTitle>
              <CardDescription>Highest CTC campus opportunities</CardDescription>
            </div>
            <Link
              to="/companies"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Explore
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topRecruitingCompanies.map((comp) => (
              <Link
                key={comp.id}
                to="/companies"
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 transition-all hover:border-indigo-200 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:border-indigo-800 dark:hover:bg-slate-800/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <CompanyAvatar
                    name={comp.name}
                    initials={comp.initials}
                    brandColor={comp.brandColor}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {comp.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {comp.role}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {comp.packageLPA} LPA
                  </p>
                  <p className="text-[11px] text-slate-400">{comp.openings} roles</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

