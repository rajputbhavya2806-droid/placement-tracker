export function formatDate(dateStr, options = {}) {
  if (!dateStr) return '—';
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

export function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '—';
  const formattedDate = formatDate(dateStr, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  return timeStr ? `${formattedDate} · ${formatTime(timeStr)}` : formattedDate;
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hoursStr, minutesStr] = timeStr.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return timeStr;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function getDaysRemaining(deadlineStr) {
  if (!deadlineStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadlineStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function isValidUrl(url) {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function formatPackageLabel(lpa) {
  if (lpa === undefined || lpa === null || lpa === '') return '—';
  return `${lpa} LPA`;
}

