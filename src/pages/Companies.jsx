import React, { useMemo, useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Eye,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { APPLICATION_STATUSES, INDUSTRIES, PACKAGE_FILTERS } from '../utils/constants';
import { formatDate, getDaysRemaining } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { CompanyAvatar } from '../components/ui/CompanyAvatar';
import { Modal } from '../components/ui/Modal';
import { Input, Select, Textarea } from '../components/ui/FormControls';
import { EmptyState } from '../components/ui/EmptyState';

const INITIAL_COMPANY_FORM = {
  name: '',
  industry: INDUSTRIES[0],
  role: '',
  packageLPA: '',
  location: '',
  deadline: '',
  eligibility: '',
  applicationStatus: 'Not Applied',
  openings: '10',
  description: '',
};

export function Companies() {
  const { companies, addCompany, applyToCompany, globalSearch } = usePlacement();

  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline-asc');
  const [viewMode, setViewMode] = useState('grid');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState(INITIAL_COMPANY_FORM);
  const [formErrors, setFormErrors] = useState({});

  const availableIndustries = useMemo(() => {
    const set = new Set([...INDUSTRIES, ...companies.map((c) => c.industry)]);
    return Array.from(set);
  }, [companies]);

  const effectiveSearch = (searchQuery || globalSearch).trim().toLowerCase();

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((comp) => {
        if (effectiveSearch) {
          const haystack = `${comp.name} ${comp.role} ${comp.industry} ${comp.location}`.toLowerCase();
          if (!haystack.includes(effectiveSearch)) return false;
        }
        if (industryFilter !== 'all' && comp.industry !== industryFilter) {
          return false;
        }
        const ctc = Number(comp.packageLPA) || 0;
        if (packageFilter === 'under-8' && ctc >= 8) return false;
        if (packageFilter === '8-18' && (ctc < 8 || ctc > 18)) return false;
        if (packageFilter === '18-30' && (ctc <= 18 || ctc > 30)) return false;
        if (packageFilter === '30-plus' && ctc <= 30) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline-asc') {
          return new Date(a.deadline) - new Date(b.deadline);
        }
        if (sortBy === 'deadline-desc') {
          return new Date(b.deadline) - new Date(a.deadline);
        }
        if (sortBy === 'package-desc') {
          return Number(b.packageLPA) - Number(a.packageLPA);
        }
        return a.name.localeCompare(b.name);
      });
  }, [companies, effectiveSearch, industryFilter, packageFilter, sortBy]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Company name is required.';
    if (!formData.role.trim()) errors.role = 'Job role is required.';
    if (!formData.packageLPA || Number(formData.packageLPA) <= 0) {
      errors.packageLPA = 'Enter a valid package in LPA.';
    }
    if (!formData.location.trim()) errors.location = 'Location is required.';
    if (!formData.deadline) errors.deadline = 'Application deadline is required.';
    if (!formData.eligibility.trim()) errors.eligibility = 'Eligibility criteria is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    addCompany(formData);
    setFormData(INITIAL_COMPANY_FORM);
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setIndustryFilter('all');
    setPackageFilter('all');
    setSortBy('deadline-asc');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Companies Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse campus hiring drives, check eligibility criteria, and track deadlines.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Company
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, role, location..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            aria-label="Filter by industry"
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">All Industries</option>
            {availableIndustries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            aria-label="Filter by package"
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {PACKAGE_FILTERS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort companies"
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="deadline-asc">Deadline: Soonest First</option>
            <option value="deadline-desc">Deadline: Latest First</option>
            <option value="package-desc">Package: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>

        {(effectiveSearch || industryFilter !== 'all' || packageFilter !== 'all') && (
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Showing {filteredCompanies.length} of {companies.length} companies
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Reset filters
            </button>
          </div>
        )}
      </Card>

      {/* Content */}
      {filteredCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No matching companies"
          description="No placement drives match your current filters. Try clearing filters or add a new company."
          actionLabel="Add New Company"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCompanies.map((comp) => {
            const daysLeft = getDaysRemaining(comp.deadline);
            return (
              <Card key={comp.id} hover className="flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <CompanyAvatar
                        name={comp.name}
                        initials={comp.initials}
                        brandColor={comp.brandColor}
                      />
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {comp.name}
                        </h3>
                        <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                          {comp.industry}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={comp.applicationStatus} />
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {comp.role}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {comp.packageLPA} LPA
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {comp.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(comp.deadline)}
                        {daysLeft !== null && daysLeft >= 0 && daysLeft <= 7 && (
                          <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            {daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Eligibility:{' '}
                    </span>
                    {comp.eligibility}
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    className="flex-1"
                    onClick={() => setSelectedCompany(comp)}
                  >
                    View Details
                  </Button>
                  {comp.applicationStatus === 'Not Applied' ||
                  comp.applicationStatus === 'Interested' ? (
                    <Button
                      size="sm"
                      icon={Sparkles}
                      className="flex-1"
                      onClick={() => applyToCompany(comp)}
                    >
                      Quick Apply
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={CheckCircle2}
                      className="flex-1"
                      onClick={() => setSelectedCompany(comp)}
                    >
                      In Pipeline
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Company</th>
                  <th className="px-5 py-3.5">Job Role</th>
                  <th className="px-5 py-3.5">CTC</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Deadline</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCompanies.map((comp) => (
                  <tr
                    key={comp.id}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <CompanyAvatar
                          name={comp.name}
                          initials={comp.initials}
                          brandColor={comp.brandColor}
                          size="sm"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{comp.name}</p>
                          <p className="text-xs text-slate-500">{comp.industry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-200">
                      {comp.role}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-indigo-600 dark:text-indigo-400">
                      {comp.packageLPA} LPA
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {comp.location}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {formatDate(comp.deadline)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={comp.applicationStatus} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCompany(comp)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Company Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Target Company"
        subtitle="Add a new campus placement drive to track eligibility and deadlines."
        size="lg"
      >
        <form onSubmit={handleAddCompany} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Company Name"
              required
              placeholder="e.g., Atlassian"
              value={formData.name}
              error={formErrors.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Select
              label="Industry"
              required
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            >
              {availableIndustries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </Select>
            <Input
              label="Job Role"
              required
              placeholder="e.g., Software Engineer"
              value={formData.role}
              error={formErrors.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            <Input
              label="Package (LPA)"
              type="number"
              step="0.25"
              min="1"
              required
              placeholder="e.g., 24"
              value={formData.packageLPA}
              error={formErrors.packageLPA}
              onChange={(e) => setFormData({ ...formData, packageLPA: e.target.value })}
            />
            <Input
              label="Job Location"
              required
              placeholder="e.g., Bengaluru / Remote"
              value={formData.location}
              error={formErrors.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Application Deadline"
              type="date"
              required
              value={formData.deadline}
              error={formErrors.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Eligibility Criteria"
              required
              placeholder="e.g., CGPA >= 7.5 | CSE, IT | 0 Backlogs"
              value={formData.eligibility}
              error={formErrors.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
            />
            <Select
              label="Initial Status"
              value={formData.applicationStatus}
              onChange={(e) => setFormData({ ...formData, applicationStatus: e.target.value })}
            >
              <option value="Not Applied">Not Applied</option>
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>

          <Textarea
            label="Role Description / Notes"
            placeholder="Brief details about hiring rounds, required skills, or bond policy..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Company</Button>
          </div>
        </form>
      </Modal>

      {/* Company Details Modal */}
      <Modal
        isOpen={Boolean(selectedCompany)}
        onClose={() => setSelectedCompany(null)}
        title={selectedCompany?.name || 'Company Details'}
        subtitle={selectedCompany?.industry}
        size="lg"
      >
        {selectedCompany && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
              <div className="flex items-center gap-3.5">
                <CompanyAvatar
                  name={selectedCompany.name}
                  initials={selectedCompany.initials}
                  brandColor={selectedCompany.brandColor}
                  size="lg"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedCompany.role}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedCompany.location} · {selectedCompany.openings || 10} expected openings
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedCompany.packageRange || `${selectedCompany.packageLPA} LPA`}
                </p>
                <StatusBadge status={selectedCompany.applicationStatus} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/80 p-3.5 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Application Deadline
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatDate(selectedCompany.deadline)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200/80 p-3.5 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Eligibility Criteria
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                  {selectedCompany.eligibility}
                </p>
              </div>
            </div>

            {selectedCompany.description && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Overview
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedCompany.description}
                </p>
              </div>
            )}

            {selectedCompany.skillsRequired?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Key Skills Assessed
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCompany.skillsRequired.map((skill) => (
                    <Badge key={skill} variant="indigo">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedCompany.rounds?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Selection Process
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {selectedCompany.rounds.map((round, index) => (
                    <div
                      key={round}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                        {index + 1}
                      </span>
                      {round}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Button variant="outline" onClick={() => setSelectedCompany(null)}>
                Close
              </Button>
              {(selectedCompany.applicationStatus === 'Not Applied' ||
                selectedCompany.applicationStatus === 'Interested') && (
                <Button
                  icon={Sparkles}
                  onClick={() => {
                    applyToCompany(selectedCompany);
                    setSelectedCompany((prev) => ({
                      ...prev,
                      applicationStatus: 'Applied',
                    }));
                  }}
                >
                  Apply &amp; Add to Tracker
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

