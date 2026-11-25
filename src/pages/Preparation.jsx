import React, { useMemo, useState } from 'react';
import {
  BookOpenCheck,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { PREP_CATEGORIES } from '../utils/constants';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Input, Select } from '../components/ui/FormControls';
import { EmptyState } from '../components/ui/EmptyState';

const PRIORITY_BADGE = {
  High: 'rose',
  Medium: 'amber',
  Low: 'default',
};

export function Preparation() {
  const { prepTasks, addPrepTask, togglePrepTask, deletePrepTask } = usePlacement();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    category: PREP_CATEGORIES[0],
    priority: 'High',
  });
  const [formError, setFormError] = useState('');

  const overallStats = useMemo(() => {
    const total = prepTasks.length;
    const completed = prepTasks.filter((t) => t.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [prepTasks]);

  const categoryProgress = useMemo(() => {
    return PREP_CATEGORIES.map((category) => {
      const items = prepTasks.filter((t) => t.category === category);
      const done = items.filter((t) => t.completed).length;
      const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;
      return { category, total: items.length, completed: done, percentage: pct };
    });
  }, [prepTasks]);

  const filteredTasks = useMemo(() => {
    return prepTasks.filter((task) => {
      if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      return true;
    });
  }, [prepTasks, selectedCategory, statusFilter]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setFormError('Please enter a preparation task title.');
      return;
    }
    addPrepTask({
      title: newTask.title.trim(),
      category: newTask.category,
      priority: newTask.priority,
    });
    setNewTask({ title: '', category: PREP_CATEGORIES[0], priority: 'High' });
    setFormError('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Preparation Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Stay consistent across DSA, core CS subjects, aptitude, projects, and resume readiness.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Prep Task
        </Button>
      </div>

      {/* Overall Readiness Banner */}
      <Card className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-lg shadow-indigo-600/20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
              Overall Placement Readiness
            </p>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold">{overallStats.percentage}%</span>
              <span className="text-sm text-indigo-100">
                {overallStats.completed} of {overallStats.total} tasks completed
              </span>
            </div>
          </div>
          <div className="w-full sm:max-w-xs">
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${overallStats.percentage}%` }}
              />
            </div>
            <p className="mt-2 text-right text-xs text-indigo-100">
              {overallStats.total - overallStats.completed} tasks remaining
            </p>
          </div>
        </div>
      </Card>

      {/* Category Progress Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryProgress.map((cat) => {
          const isSelected = selectedCategory === cat.category;
          return (
            <Card
              key={cat.category}
              hover
              onClick={() =>
                setSelectedCategory(isSelected ? 'all' : cat.category)
              }
              className={`cursor-pointer p-4 transition-all ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 dark:border-indigo-400'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {cat.category}
                </h3>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {cat.percentage}%
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {cat.completed} / {cat.total} completed
              </p>
            </Card>
          );
        })}
      </div>

      {/* Task List & Filters */}
      <Card>
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <CardTitle>
              {selectedCategory === 'all' ? 'All Preparation Tasks' : selectedCategory}
            </CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
              >
                Show All Categories
              </button>
            )}
            {['all', 'pending', 'completed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon={BookOpenCheck}
              title="No preparation tasks here"
              description="Add a new checklist item to keep your study plan on track."
              actionLabel="Add Prep Task"
              onAction={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <button
                    type="button"
                    onClick={() => togglePrepTask(task.id)}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300 hover:text-indigo-500 dark:text-slate-600" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {task.category}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={PRIORITY_BADGE[task.priority] || 'default'}>
                      {task.priority}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(task)}
                      aria-label={`Delete ${task.title}`}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Prep Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Preparation Task"
        subtitle="Break down your placement prep into actionable milestones."
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <Input
            label="Task Title"
            required
            placeholder="e.g., Revise OS Deadlocks and Virtual Memory"
            value={newTask.title}
            error={formError}
            onChange={(e) => {
              setNewTask({ ...newTask, title: e.target.value });
              if (formError) setFormError('');
            }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Category"
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            >
              {PREP_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
            <Select
              label="Priority"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deletePrepTask(deleteTarget.id);
        }}
        title="Delete Task"
        message={`Delete "${deleteTarget?.title}" from your preparation tracker?`}
      />
    </div>
  );
}

