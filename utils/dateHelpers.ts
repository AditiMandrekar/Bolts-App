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

export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getWeekAgo = (): string => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return weekAgo.toISOString().split('T')[0];
};

export const getMonthAgo = (): string => {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return monthAgo.toISOString().split('T')[0];
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