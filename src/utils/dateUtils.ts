// Format a Date object to yyyy-mm-dd
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format a Date object to HH:MM
export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Get full timestamp
export const getTimestamp = (): string => {
  return new Date().toISOString();
};

// Get today's date in yyyy-mm-dd format
export const getTodayDate = (): string => {
  return formatDate(new Date());
};

// Get a date range (for week or month views)
export const getDateRange = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates.reverse();
};

// Format date for display (e.g., "Mon, Jan 1")
export const formatDateForDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// Check if a date is today
export const isToday = (dateStr: string): boolean => {
  return dateStr === getTodayDate();
};

// Get day of week (0-6, where 0 is Sunday)
export const getDayOfWeek = (dateStr: string): number => {
  return new Date(dateStr).getDay();
};

// Get week number of the date
export const getWeekNumber = (dateStr: string): number => {
  const date = new Date(dateStr);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Get days of current week
export const getDaysOfCurrentWeek = (): string[] => {
  return getDateRange(7);
};
