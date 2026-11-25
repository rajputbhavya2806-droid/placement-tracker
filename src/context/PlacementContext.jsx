import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  SAMPLE_APPLICATIONS,
  SAMPLE_COMPANIES,
  SAMPLE_INTERVIEWS,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_PREP_TASKS,
  SAMPLE_PROFILE,
} from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId, getInitials } from '../utils/formatters';

const PlacementContext = createContext(null);

const BRAND_GRADIENTS = [
  'from-indigo-600 to-blue-600',
  'from-violet-600 to-purple-600',
  'from-emerald-600 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-cyan-600 to-blue-600',
  'from-rose-500 to-pink-600',
];

export function PlacementProvider({ children }) {
  const [companies, setCompanies] = useLocalStorage('pt_companies_v1', SAMPLE_COMPANIES);
  const [applications, setApplications] = useLocalStorage('pt_applications_v1', SAMPLE_APPLICATIONS);
  const [interviews, setInterviews] = useLocalStorage('pt_interviews_v1', SAMPLE_INTERVIEWS);
  const [prepTasks, setPrepTasks] = useLocalStorage('pt_prep_tasks_v1', SAMPLE_PREP_TASKS);
  const [profile, setProfile] = useLocalStorage('pt_profile_v1', SAMPLE_PROFILE);
  const [notifications, setNotifications] = useLocalStorage('pt_notifications_v1', SAMPLE_NOTIFICATIONS);
  const [theme, setTheme] = useLocalStorage('pt_theme_v1', 'light');

  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState([]);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = generateId('toast');
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        dismissToast(id);
      }, 3600);
    },
    [dismissToast]
  );

  const pushNotification = useCallback(
    (title, message, route = '/') => {
      const notif = {
        id: generateId('notif'),
        title,
        message,
        time: 'Just now',
        read: false,
        route,
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 12));
    },
    [setNotifications]
  );

  // Companies CRUD
  const addCompany = useCallback(
    (companyData) => {
      const newCompany = {
        ...companyData,
        id: generateId('comp'),
        initials: getInitials(companyData.name),
        brandColor: BRAND_GRADIENTS[Math.floor(Math.random() * BRAND_GRADIENTS.length)],
        packageLPA: Number(companyData.packageLPA),
        packageRange: companyData.packageRange || `${companyData.packageLPA} LPA`,
        openings: Number(companyData.openings) || 10,
        rounds: companyData.rounds?.length
          ? companyData.rounds
          : ['Online Assessment', 'Technical Interview', 'HR Interview'],
        skillsRequired: companyData.skillsRequired?.length
          ? companyData.skillsRequired
          : ['DSA', 'Problem Solving', 'Core CS'],
        applicationStatus: companyData.applicationStatus || 'Not Applied',
      };
      setCompanies((prev) => [newCompany, ...prev]);
      showToast(`${newCompany.name} added to target companies.`);
      pushNotification('New Company Added', `${newCompany.name} (${newCompany.role}) added.`, '/companies');
      return newCompany;
    },
    [setCompanies, showToast, pushNotification]
  );

  const syncCompanyStatusByName = useCallback(
    (companyName, status) => {
      setCompanies((prev) =>
        prev.map((c) =>
          c.name.toLowerCase() === companyName.trim().toLowerCase()
            ? { ...c, applicationStatus: status }
            : c
        )
      );
    },
    [setCompanies]
  );

  // Applications CRUD
  const addApplication = useCallback(
    (appData) => {
      const newApp = {
        ...appData,
        id: generateId('app'),
        packageLPA: Number(appData.packageLPA),
      };
      setApplications((prev) => [newApp, ...prev]);
      syncCompanyStatusByName(newApp.companyName, newApp.status);
      showToast(`Application for ${newApp.companyName} added.`);
      pushNotification(
        'Application Logged',
        `${newApp.companyName} — ${newApp.position} (${newApp.status})`,
        '/applications'
      );
      return newApp;
    },
    [setApplications, syncCompanyStatusByName, showToast, pushNotification]
  );

  const updateApplication = useCallback(
    (id, updates) => {
      const existing = applications.find((app) => app.id === id);
      if (!existing) return;
      const updatedRecord = {
        ...existing,
        ...updates,
        packageLPA:
          updates.packageLPA !== undefined ? Number(updates.packageLPA) : existing.packageLPA,
      };
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updatedRecord : app))
      );
      syncCompanyStatusByName(updatedRecord.companyName, updatedRecord.status);
      showToast('Application updated successfully.');
    },
    [applications, setApplications, syncCompanyStatusByName, showToast]
  );

  const updateApplicationStatus = useCallback(
    (id, newStatus) => {
      const existing = applications.find((app) => app.id === id);
      if (!existing) return;
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      syncCompanyStatusByName(existing.companyName, newStatus);
      showToast(`${existing.companyName} moved to ${newStatus}.`);
    },
    [applications, setApplications, syncCompanyStatusByName, showToast]
  );

  const deleteApplication = useCallback(
    (id) => {
      const deleted = applications.find((a) => a.id === id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (deleted) {
        syncCompanyStatusByName(deleted.companyName, 'Not Applied');
      }
      showToast('Application deleted.', 'info');
    },
    [applications, setApplications, syncCompanyStatusByName, showToast]
  );

  // Quick apply from Company Details / Card
  const applyToCompany = useCallback(
    (company) => {
      const existing = applications.find(
        (a) => a.companyName.toLowerCase() === company.name.toLowerCase()
      );
      if (existing) {
        updateApplicationStatus(existing.id, 'Applied');
        return;
      }
      addApplication({
        companyId: company.id,
        companyName: company.name,
        position: company.role,
        appliedDate: new Date().toISOString().split('T')[0],
        packageLPA: company.packageLPA,
        status: 'Applied',
        notes: `Applied via PlaceTrack for ${company.location}.`,
      });
    },
    [applications, addApplication, updateApplicationStatus]
  );

  // Interviews CRUD
  const addInterview = useCallback(
    (interviewData) => {
      const newInterview = {
        ...interviewData,
        id: generateId('int'),
        completed: Boolean(interviewData.completed),
      };
      setInterviews((prev) => [newInterview, ...prev]);
      showToast(`Interview scheduled with ${newInterview.companyName}.`);
      pushNotification(
        `Interview Scheduled: ${newInterview.companyName}`,
        `${newInterview.round} on ${newInterview.date}`,
        '/interviews'
      );
      return newInterview;
    },
    [setInterviews, showToast, pushNotification]
  );

  const updateInterview = useCallback(
    (id, updates) => {
      setInterviews((prev) =>
        prev.map((iv) => (iv.id === id ? { ...iv, ...updates } : iv))
      );
      showToast('Interview updated.');
    },
    [setInterviews, showToast]
  );

  const toggleInterviewCompleted = useCallback(
    (id) => {
      const existing = interviews.find((iv) => iv.id === id);
      if (!existing) return;
      const becameCompleted = !existing.completed;
      setInterviews((prev) =>
        prev.map((iv) => (iv.id === id ? { ...iv, completed: becameCompleted } : iv))
      );
      showToast(
        becameCompleted ? 'Interview marked as completed.' : 'Interview moved back to upcoming.'
      );
    },
    [interviews, setInterviews, showToast]
  );

  const deleteInterview = useCallback(
    (id) => {
      setInterviews((prev) => prev.filter((iv) => iv.id !== id));
      showToast('Interview removed.', 'info');
    },
    [setInterviews, showToast]
  );

  // Preparation Tasks CRUD
  const addPrepTask = useCallback(
    (taskData) => {
      const newTask = {
        ...taskData,
        id: generateId('prep'),
        completed: false,
      };
      setPrepTasks((prev) => [newTask, ...prev]);
      showToast('Preparation task added.');
      return newTask;
    },
    [setPrepTasks, showToast]
  );

  const togglePrepTask = useCallback(
    (id) => {
      setPrepTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    },
    [setPrepTasks]
  );

  const deletePrepTask = useCallback(
    (id) => {
      setPrepTasks((prev) => prev.filter((task) => task.id !== id));
      showToast('Preparation task deleted.', 'info');
    },
    [setPrepTasks, showToast]
  );

  // Profile
  const updateProfile = useCallback(
    (updates) => {
      setProfile((prev) => ({ ...prev, ...updates }));
      showToast('Profile settings saved.');
    },
    [setProfile, showToast]
  );

  // Notifications
  const markNotificationRead = useCallback(
    (id) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    },
    [setNotifications]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  }, [setNotifications, showToast]);

  const resetDemoData = useCallback(() => {
    setCompanies(SAMPLE_COMPANIES);
    setApplications(SAMPLE_APPLICATIONS);
    setInterviews(SAMPLE_INTERVIEWS);
    setPrepTasks(SAMPLE_PREP_TASKS);
    setProfile(SAMPLE_PROFILE);
    setNotifications(SAMPLE_NOTIFICATIONS);
    showToast('Sample placement data restored.', 'info');
  }, [
    setCompanies,
    setApplications,
    setInterviews,
    setPrepTasks,
    setProfile,
    setNotifications,
    showToast,
  ]);

  const value = {
    companies,
    applications,
    interviews,
    prepTasks,
    profile,
    notifications,
    theme,
    toggleTheme,
    globalSearch,
    setGlobalSearch,
    toasts,
    showToast,
    dismissToast,
    addCompany,
    applyToCompany,
    addApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
    addInterview,
    updateInterview,
    toggleInterviewCompleted,
    deleteInterview,
    addPrepTask,
    togglePrepTask,
    deletePrepTask,
    updateProfile,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
  };

  return <PlacementContext.Provider value={value}>{children}</PlacementContext.Provider>;
}

export function usePlacement() {
  const ctx = useContext(PlacementContext);
  if (!ctx) {
    throw new Error('usePlacement must be used within a PlacementProvider');
  }
  return ctx;
}
