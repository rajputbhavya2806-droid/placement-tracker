import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  BookOpenCheck,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCheck,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Moon,
  RotateCcw,
  Search,
  Sun,
  UserCog,
  X,
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { getInitials } from '../utils/formatters';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/applications', label: 'My Applications', icon: Briefcase },
  { to: '/interviews', label: 'Interview Tracker', icon: CalendarClock },
  { to: '/preparation', label: 'Preparation Tracker', icon: BookOpenCheck },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile & Settings', icon: UserCog },
];

export function MainLayout() {
  const {
    profile,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    theme,
    toggleTheme,
    globalSearch,
    setGlobalSearch,
    resetDemoData,
  } = usePlacement();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/companies' && location.pathname !== '/applications') {
      navigate('/companies');
    }
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-slate-800">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/25">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-base font-bold tracking-tight text-slate-900 dark:text-white">
              PlaceTrack
            </span>
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Campus Placement Suite
            </span>
          </div>
        </NavLink>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          aria-label="Close navigation menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Workspace
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sample Data Banner + Footer */}
      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Demo Mode Active
            </span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Sample Data
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            Changes save automatically in your browser&apos;s localStorage.
          </p>
          <button
            type="button"
            onClick={resetDemoData}
            className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Sample Data
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white lg:fixed lg:inset-y-0 lg:flex lg:flex-col dark:border-slate-800 dark:bg-slate-900">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl dark:bg-slate-900">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <form onSubmit={handleGlobalSearchSubmit} className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search companies, roles, or applications..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-10 pr-8 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-800"
                />
                {globalSearch && (
                  <button
                    type="button"
                    onClick={() => setGlobalSearch('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </form>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Current Date Pill */}
              <div className="hidden rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 md:block dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                {currentDateFormatted}
              </div>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((prev) => !prev)}
                  aria-label="Toggle notifications"
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-fade-in dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Notifications
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {unreadCount} unread updates
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-center text-xs text-slate-500">
                          No notifications yet.
                        </p>
                      ) : (
                        notifications.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              markNotificationRead(item.id);
                              setNotifOpen(false);
                              if (item.route) navigate(item.route);
                            }}
                            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/70 ${
                              !item.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                            }`}
                          >
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                item.read ? 'bg-slate-300 dark:bg-slate-700' : 'bg-indigo-600'
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                                {item.title}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                {item.message}
                              </p>
                              <p className="mt-1 text-[10px] font-medium text-slate-400">
                                {item.time}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Avatar */}
              <NavLink
                to="/profile"
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white py-1 pl-1.5 pr-2.5 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-700"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-xs font-bold text-white">
                  {getInitials(profile.name)}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="max-w-[110px] truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    CGPA {profile.cgpa}
                  </p>
                </div>
              </NavLink>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

