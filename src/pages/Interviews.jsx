import React, { useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  Edit3,
  ExternalLink,
  MapPin,
  Plus,
  Search,
  Trash2,
  Video,
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { INTERVIEW_ROUNDS, INTERVIEW_TYPES } from '../utils/constants';
import { formatDateTime, isValidUrl } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Input, Select, Textarea } from '../components/ui/FormControls';
import { EmptyState } from '../components/ui/EmptyState';

const EMPTY_INTERVIEW_FORM = {
  companyName: '',
  round: INTERVIEW_ROUNDS[1],
  date: '',
  time: '11:00',
  type: 'Online',
  meetingLink: '',
  notes: '',
};

export function Interviews() {
  const {
    interviews,
    addInterview,
    updateInterview,
    toggleInterviewCompleted,
    deleteInterview,
  } = usePlacement();

  const [tab, setTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [formData, setFormData] = useState(EMPTY_INTERVIEW_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const upcomingCount = interviews.filter((i) => !i.completed).length;
  const completedCount = interviews.filter((i) => i.completed).length;

  const filteredInterviews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return interviews
      .filter((iv) => {
        if (tab === 'upcoming' && iv.completed) return false;
        if (tab === 'completed' && !iv.completed) return false;
        if (q) {
          const text = `${iv.companyName} ${iv.round} ${iv.notes}`.toLowerCase();
          if (!text.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`));
  }, [interviews, tab, searchQuery]);

  const openAddModal = () => {
    setEditingInterview(null);
    setFormData(EMPTY_INTERVIEW_FORM);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (iv) => {
    setEditingInterview(iv);
    setFormData({
      companyName: iv.companyName,
      round: iv.round,
      date: iv.date,
      time: iv.time || '11:00',
      type: iv.type,
      meetingLink: iv.meetingLink || '',
      notes: iv.notes || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required.';
    if (!formData.round.trim()) errors.round = 'Interview round is required.';
    if (!formData.date) errors.date = 'Interview date is required.';
    if (!formData.time) errors.time = 'Interview time is required.';
    if (formData.type === 'Online' && formData.meetingLink && !isValidUrl(formData.meetingLink)) {
      errors.meetingLink = 'Enter a valid http:// or https:// meeting URL.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingInterview) {
      updateInterview(editingInterview.id, formData);
    } else {
      addInterview(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interview Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Organize upcoming interview rounds, meeting links, and round-specific prep notes.
          </p>
        </div>
        <Button icon={Plus} onClick={openAddModal}>
          Schedule Interview
        </Button>
      </div>

      {/* Tabs & Search */}
      <Card className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab('upcoming')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              tab === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            type="button"
            onClick={() => setTab('completed')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              tab === 'completed'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            type="button"
            onClick={() => setTab('all')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              tab === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            All ({interviews.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interviews..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </Card>

      {/* Interviews List */}
      {filteredInterviews.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title={tab === 'upcoming' ? 'No upcoming interviews' : 'No interviews found'}
          description="Schedule your next technical or HR interview to keep meeting links and prep notes handy."
          actionLabel="Schedule Interview"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredInterviews.map((iv) => (
            <Card
              key={iv.id}
              hover
              className={`p-5 ${
                iv.completed ? 'opacity-85 dark:opacity-80' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {iv.companyName}
                    </h3>
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
                    {iv.completed && <Badge variant="emerald">Completed</Badge>}
                  </div>
                  <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {iv.round}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(iv)}
                    aria-label="Edit interview"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(iv)}
                    aria-label="Delete interview"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <CalendarClock className="h-4 w-4 text-slate-400" />
                  {formatDateTime(iv.date, iv.time)}
                </span>
                {iv.type === 'Online' && iv.meetingLink && (
                  <a
                    href={iv.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Join Meeting <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              {iv.notes && (
                <div className="mt-3.5 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Prep Notes:{' '}
                  </span>
                  {iv.notes}
                </div>
              )}

              <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3.5 dark:border-slate-800">
                <Button
                  variant={iv.completed ? 'outline' : 'primary'}
                  size="sm"
                  icon={iv.completed ? Circle : CheckCircle2}
                  onClick={() => toggleInterviewCompleted(iv.id)}
                >
                  {iv.completed ? 'Mark as Upcoming' : 'Mark Completed'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInterview ? 'Edit Interview' : 'Schedule New Interview'}
        subtitle="Track interview date, format, meeting URL, and preparation notes."
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
            <Select
              label="Interview Round"
              required
              value={formData.round}
              error={formErrors.round}
              onChange={(e) => setFormData({ ...formData, round: e.target.value })}
            >
              {INTERVIEW_ROUNDS.map((round) => (
                <option key={round} value={round}>
                  {round}
                </option>
              ))}
            </Select>
            <Input
              label="Date"
              type="date"
              required
              value={formData.date}
              error={formErrors.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <Input
              label="Time"
              type="time"
              required
              value={formData.time}
              error={formErrors.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Interview Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {INTERVIEW_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>

            <Input
              label="Meeting Link (for Online)"
              placeholder="https://meet.google.com/..."
              value={formData.meetingLink}
              error={formErrors.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
            />
          </div>

          <Textarea
            label="Preparation Notes"
            placeholder="Topics to revise, room/building number for offline rounds, interviewer focus..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingInterview ? 'Save Changes' : 'Schedule Interview'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteInterview(deleteTarget.id);
        }}
        title="Delete Interview"
        message={`Remove the ${deleteTarget?.round} interview with ${deleteTarget?.companyName}?`}
      />
    </div>
  );
}

