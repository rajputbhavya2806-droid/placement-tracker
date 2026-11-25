import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  FileText,
  GraduationCap,
  Moon,
  Plus,
  RotateCcw,
  Save,
  Sun,
  Upload,
  X,
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { getInitials } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/FormControls';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export function Profile() {
  const { profile, updateProfile, theme, toggleTheme, resetDemoData, showToast } = usePlacement();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const fileInputRef = useRef(null);

  const startEditing = () => {
    setFormData(profile);
    setErrors({});
    setIsEditing(true);
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Student name is required.';
    if (!formData.collegeName.trim()) nextErrors.collegeName = 'College name is required.';
    if (!formData.branch.trim()) nextErrors.branch = 'Branch is required.';
    if (!formData.graduationYear.trim() || !/^\d{4}$/.test(formData.graduationYear.trim())) {
      nextErrors.graduationYear = 'Enter a valid 4-digit graduation year.';
    }
    const cgpaVal = Number(formData.cgpa);
    if (Number.isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      nextErrors.cgpa = 'CGPA must be between 0.0 and 10.0.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!validate()) return;
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    const cleaned = skillInput.trim();
    if (!cleaned) return;
    const currentSkills = isEditing ? formData.skills : profile.skills;
    if (currentSkills.some((s) => s.toLowerCase() === cleaned.toLowerCase())) {
      showToast('Skill already added.', 'info');
      setSkillInput('');
      return;
    }
    const updatedSkills = [...currentSkills, cleaned];
    if (isEditing) {
      setFormData({ ...formData, skills: updatedSkills });
    } else {
      updateProfile({ skills: updatedSkills });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const currentSkills = isEditing ? formData.skills : profile.skills;
    const updatedSkills = currentSkills.filter((s) => s !== skillToRemove);
    if (isEditing) {
      setFormData({ ...formData, skills: updatedSkills });
    } else {
      updateProfile({ skills: updatedSkills });
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['.pdf', '.doc', '.docx'];
    const lowerName = file.name.toLowerCase();
    if (!allowed.some((ext) => lowerName.endsWith(ext))) {
      showToast('Please select a PDF, DOC, or DOCX file.', 'error');
      return;
    }
    const sizeKB = Math.max(1, Math.round(file.size / 1024));
    updateProfile({
      resumeFileName: file.name,
      resumeSize: sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`,
      resumeUpdatedAt: new Date().toISOString().split('T')[0],
    });
    e.target.value = '';
  };

  const displayedSkills = isEditing ? formData.skills : profile.skills;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Profile &amp; Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your academic details, technical skills, resume, and workspace preferences.
          </p>
        </div>
        {!isEditing && (
          <Button icon={Edit3} onClick={startEditing}>
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Academic Profile Card */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-xl font-bold text-white shadow-md shadow-indigo-600/20">
                  {getInitials(profile.name)}
                </div>
                <div>
                  <CardTitle className="text-lg">{profile.name}</CardTitle>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {profile.branch} · Batch of {profile.graduationYear}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="indigo">CGPA {profile.cgpa}</Badge>
                    <Badge variant="emerald">{profile.targetRole || 'SDE Candidate'}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      label="Student Name"
                      required
                      value={formData.name}
                      error={errors.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                      label="College Name"
                      required
                      value={formData.collegeName}
                      error={errors.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    />
                    <Input
                      label="Branch / Department"
                      required
                      value={formData.branch}
                      error={errors.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    />
                    <Input
                      label="Graduation Year"
                      required
                      value={formData.graduationYear}
                      error={errors.graduationYear}
                      onChange={(e) =>
                        setFormData({ ...formData, graduationYear: e.target.value })
                      }
                    />
                    <Input
                      label="CGPA (out of 10)"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      required
                      value={formData.cgpa}
                      error={errors.cgpa}
                      onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Target Job Role"
                    value={formData.targetRole || ''}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  />

                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" icon={Save}>
                      Save Profile
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                    <p className="text-xs font-medium text-slate-400">College Name</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      <GraduationCap className="h-4 w-4 text-indigo-500" />
                      {profile.collegeName}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                    <p className="text-xs font-medium text-slate-400">Branch</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {profile.branch}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                    <p className="text-xs font-medium text-slate-400">Graduation Year</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {profile.graduationYear}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                    <p className="text-xs font-medium text-slate-400">Current CGPA</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {profile.cgpa} / 10.0
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 sm:col-span-2 dark:border-slate-800 dark:bg-slate-800/50">
                    <p className="text-xs font-medium text-slate-400">Student Email</p>
                    <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                      {profile.email}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Technical Skills</CardTitle>
                <CardDescription>
                  Highlight key technologies for campus placement drives
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {displayedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="rounded-full p-0.5 hover:bg-indigo-200/70 dark:hover:bg-indigo-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add a skill (e.g., Docker, Spring Boot)..."
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <Button variant="outline" icon={Plus} onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Resume Upload UI & Preferences */}
        <div className="space-y-6">
          {/* Resume Upload Card (Frontend Only) */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Resume Upload</CardTitle>
                <CardDescription>
                  Frontend-only resume preview &amp; local metadata storage
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.resumeFileName ? (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/40">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {profile.resumeFileName}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {profile.resumeSize || '240 KB'} · Updated {profile.resumeUpdatedAt}
                    </p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                </div>
              ) : (
                <p className="text-xs text-slate-500">No resume uploaded yet.</p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-indigo-500"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Click to upload new resume
                </p>
                <p className="mt-1 text-[11px] text-slate-400">PDF, DOC, DOCX (max 5MB)</p>
              </button>

              {profile.resumeFileName && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400"
                  onClick={() =>
                    updateProfile({
                      resumeFileName: '',
                      resumeSize: '',
                      resumeUpdatedAt: '',
                    })
                  }
                >
                  Remove Saved Resume
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Workspace Settings</CardTitle>
                <CardDescription>Appearance and local browser storage</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3.5 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Theme Mode
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Currently {theme === 'dark' ? 'Dark' : 'Light'} mode
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={theme === 'dark' ? Sun : Moon}
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3.5 dark:border-slate-800">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Sample Dataset
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Restore initial mock placement records
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={RotateCcw}
                  onClick={() => setConfirmResetOpen(true)}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={resetDemoData}
        title="Reset Sample Data"
        message="This will restore all companies, applications, interviews, preparation tasks, and profile details back to the default sample dataset."
        confirmLabel="Restore Data"
      />
    </div>
  );
}

