/**
 * Utilities for handling dates in the app
 */

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format date for display
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time for display
export const formatTimeForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get date and time for display
export const formatDateTimeForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return `${formatDateForDisplay(dateString)} ${date.toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )}`;
};

// Returns an array of last n days
export const getLastNDays = (n: number): string[] => {
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(formatDate(date));
  }
  return result;
};

// Returns an array of last n days for display (shorter format)
export const getLastNDaysShort = (n: number): string[] => {
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(
      date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    );
  }
  return result;
};

// Get the day of week
export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {weekday: 'short'});
};

// Check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Get the current week's dates
export const getCurrentWeekDates = (): string[] => {
  const result: string[] = [];
  const current = new Date();
  const first = current.getDate() - current.getDay();

  for (let i = 0; i < 7; i++) {
    const day = new Date(current.setDate(first + i));
    result.push(formatDate(day));
  }

  return result;
};
