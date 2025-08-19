// Date and time utility functions

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTimeShort = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(d);
};

export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getYesterday = (): string => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return yesterday.toISOString().split('T')[0];
};

export const getWeekAgo = (): string => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return weekAgo.toISOString().split('T')[0];
};

export const getMonthAgo = (): string => {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return monthAgo.toISOString().split('T')[0];
};

export const getStartOfWeek = (): string => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  return startOfWeek.toISOString().split('T')[0];
};

export const getStartOfMonth = (): string => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return startOfMonth.toISOString().split('T')[0];
};

export const isToday = (date: string | Date): boolean => {
  const today = new Date().toDateString();
  const checkDate = new Date(date).toDateString();
  return today === checkDate;
};

export const isThisWeek = (date: string | Date): boolean => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const checkDate = new Date(date);
  return checkDate >= weekAgo;
};

export const isThisMonth = (date: string | Date): boolean => {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const checkDate = new Date(date);
  return checkDate >= monthAgo;
};

export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTimeForInput = (date: Date): string => {
  return date.toTimeString().split(' ')[0].substring(0, 5);
};

export const formatDateTimeForInput = (date: Date): string => {
  const isoString = date.toISOString();
  return isoString.substring(0, 16); // YYYY-MM-DDTHH:MM format
};

export const getDateRange = (period: 'today' | 'week' | 'month' | 'year') => {
  const now = new Date();
  let startDate: Date;
  let endDate = new Date(now);

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return {
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(endDate),
  };
};