import React, { useMemo } from 'react';
import { Award, Briefcase, Percent, Target } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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
  getCompanyWiseStats,
  getMonthlyApplicationTrends,
  getStatusDistribution,
} from '../utils/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { EmptyState } from '../components/ui/EmptyState';

export function Analytics() {
  const { companies, applications, interviews } = usePlacement();

  const metrics = useMemo(
    () => computeDashboardMetrics(companies, applications, interviews),
    [companies, applications, interviews]
  );

  const statusData = useMemo(() => getStatusDistribution(applications), [applications]);
  const monthlyTrends = useMemo(() => getMonthlyApplicationTrends(applications), [applications]);
  const companyWiseData = useMemo(
    () => getCompanyWiseStats(companies, applications).slice(0, 10),
    [companies, applications]
  );

  const avgPackage = useMemo(() => {
    if (applications.length === 0) return 0;
    const sum = applications.reduce((acc, app) => acc + (Number(app.packageLPA) || 0), 0);
    return (sum / applications.length).toFixed(1);
  }, [applications]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Placement Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Measure funnel conversion rates, monthly momentum, and company-level traction.
        </p>
      </div>

      {/* Conversion KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={metrics.totalApplications}
          subtitle={`Across ${metrics.totalCompanies} tracked companies`}
          icon={Briefcase}
          accent="indigo"
        />
        <StatCard
          title="App-to-Interview Rate"
          value={`${metrics.appToInterviewRate}%`}
          subtitle="Reached Technical / HR rounds"
          icon={Target}
          accent="blue"
        />
        <StatCard
          title="Interview-to-Selection"
          value={`${metrics.interviewToSelectionRate}%`}
          subtitle={`${metrics.offersReceived} offer(s) converted`}
          icon={Award}
          accent="emerald"
        />
        <StatCard
          title="Average Applied CTC"
          value={`${avgPackage} LPA`}
          subtitle="Mean package across applications"
          icon={Percent}
          accent="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Application Trends */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Monthly Application Trends</CardTitle>
              <CardDescription>
                Applications, shortlisted rounds, and offers over time
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
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
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    name="Applied"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="shortlisted"
                    name="Shortlisted"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="offers"
                    name="Selected"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>
                Current stage breakdown of your job applications
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <EmptyState
                title="No application records"
                description="Log applications to view your stage breakdown."
              />
            ) : (
              <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={84}
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
                <div className="space-y-2.5">
                  {statusData.map((item) => {
                    const pct =
                      applications.length > 0
                        ? Math.round((item.value / applications.length) * 100)
                        : 0;
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            {item.name}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {item.value} ({pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Company-Wise Applications & Package */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Company-Wise Applications &amp; Package (LPA)</CardTitle>
            <CardDescription>
              Compare application volume and offered CTC across target recruiters
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {companyWiseData.length === 0 ? (
            <EmptyState
              title="No company analytics available"
              description="Add companies or applications to populate this chart."
            />
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={companyWiseData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                  <XAxis
                    dataKey="company"
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar
                    yAxisId="left"
                    dataKey="applications"
                    name="Applications"
                    fill="#4F46E5"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="packageLPA"
                    name="Package (LPA)"
                    fill="#06B6D4"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

