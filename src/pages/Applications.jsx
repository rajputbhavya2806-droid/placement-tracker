import React, { useMemo, useState } from 'react';
import { Briefcase, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { APPLICATION_STATUSES } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Input, Select, Textarea } from '../components/ui/FormControls';
import { EmptyState } from '../components/ui/EmptyState';

const EMPTY_APP_FORM = {
  companyName: '',
  position: '',
  appliedDate: new Date().toISOString().split('T')[0],
  packageLPA: '',
  status: 'Applied',
  notes: '',
};

export function Applications() {
  const {
    applications,
    addApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
    globalSearch,
  } = usePlacement();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState(EMPTY_APP_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const effectiveSearch = (searchQuery || globalSearch).trim().toLowerCase();

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        if (statusFilter !== 'all' && app.status !== statusFilter) return false;
        if (effectiveSearch) {
          const text = `${app.companyName} ${app.position} ${app.status}`.toLowerCase();
          if (!text.includes(effectiveSearch)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
  }, [applications, statusFilter, effectiveSearch]);

  const openAddModal = () => {
    setEditingApp(null);
    setFormData({
      ...EMPTY_APP_FORM,
      appliedDate: new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setFormData({
      companyName: app.companyName,
      position: app.position,
      appliedDate: app.appliedDate,
      packageLPA: String(app.packageLPA),
      status: app.status,
      notes: app.notes || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required.';
    if (!formData.position.trim()) errors.position = 'Position is required.';
    if (!formData.appliedDate) errors.appliedDate = 'Applied date is required.';
    if (!formData.packageLPA || Number(formData.packageLPA) <= 0) {
      errors.packageLPA = 'Enter a valid package (LPA).';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingApp) {
      updateApplication(editingApp.id, formData);
    } else {
      addApplication(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage every job application and update round statuses in real time.
          </p>
        </div>
        <Button icon={Plus} onClick={openAddModal}>
          Add Application
        </Button>
      </div>

      {/* Status Pills + Search */}
      <Card className="space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or position..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-800 dark:text-white">{filteredApplications.length}</span> of {applications.length} applications
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            All ({applications.length})
          </button>
          {APPLICATION_STATUSES.map((status) => {
            const count = applications.filter((a) => a.status === status).length;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>
      </Card>

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications found"
          description="You haven't logged any matching applications yet. Add one to track your placement journey."
          actionLabel="Add Application"
          onAction={openAddModal}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Company</th>
                  <th className="px-5 py-3.5">Position</th>
                  <th className="px-5 py-3.5">Applied Date</th>
                  <th className="px-5 py-3.5">Package</th>
                  <th className="px-5 py-3.5">Current Status</th>
                  <th className="px-5 py-3.5">Quick Update</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {app.companyName}
                      </p>
                      {app.notes && (
                        <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                          {app.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-200">
                      {app.position}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {formatDate(app.appliedDate)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-indigo-600 dark:text-indigo-400">
                      {app.packageLPA} LPA
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={app.status}
                        aria-label={`Change status for ${app.companyName}`}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {APPLICATION_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(app)}
                          aria-label={`Edit ${app.companyName}`}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(app)}
                          aria-label={`Delete ${app.companyName}`}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApp ? 'Edit Application' : 'Add Job Application'}
        subtitle="Keep your placement records accurate so dashboard metrics stay up to date."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Company Name"
              required
              placeholder="e.g., Google"
              value={formData.companyName}
              error={formErrors.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
            <Input
              label="Position / Role"
              required
              placeholder="e.g., SDE - 1"
              value={formData.position}
              error={formErrors.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
            <Input
              label="Applied Date"
              type="date"
              required
              value={formData.appliedDate}
              error={formErrors.appliedDate}
              onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
            />
            <Input
              label="Package (LPA)"
              type="number"
              step="0.25"
              min="1"
              required
              placeholder="e.g., 18"
              value={formData.packageLPA}
              error={formErrors.packageLPA}
              onChange={(e) => setFormData({ ...formData, packageLPA: e.target.value })}
            />
          </div>

          <Select
            label="Application Status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>

          <Textarea
            label="Notes"
            placeholder="Referral details, OA score, recruiter feedback..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingApp ? 'Save Changes' : 'Add Application'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteApplication(deleteTarget.id);
        }}
        title="Delete Application"
        message={`Are you sure you want to delete your ${deleteTarget?.companyName} (${deleteTarget?.position}) application? This cannot be undone.`}
      />
    </div>
  );
}

