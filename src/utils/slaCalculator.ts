// Business Days and SLA Engine according to FR-031, SLA-001, SLA-002, SLA-003

export const US_HOLIDAYS_2026 = [
  '2026-01-01', // New Year's Day
  '2026-01-19', // MLK Day
  '2026-02-16', // Washington's Birthday / Presidents Day
  '2026-05-25', // Memorial Day
  '2026-06-19', // Juneteenth
  '2026-07-04', // Independence Day
  '2026-09-07', // Labor Day
  '2026-10-12', // Columbus Day
  '2026-11-11', // Veterans Day
  '2026-11-26', // Thanksgiving Day
  '2026-12-25', // Christmas Day
];

export function isBusinessDay(date: Date, holidays: string[] = US_HOLIDAYS_2026): boolean {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return false; // Sunday or Saturday

  const dateStr = date.toISOString().split('T')[0];
  if (holidays.includes(dateStr)) return false;

  return true;
}

export function addBusinessDays(startDateStr: string, days: number, holidays: string[] = US_HOLIDAYS_2026): string {
  const date = new Date(startDateStr);
  let added = 0;
  
  while (added < days) {
    date.setDate(date.getDate() + 1);
    if (isBusinessDay(date, holidays)) {
      added++;
    }
  }

  return date.toISOString().split('T')[0];
}

export function calculateBusinessDays(startDateStr: string, endDateStr: string, holidays: string[] = US_HOLIDAYS_2026): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  if (start > end) return 0;

  let businessDays = 0;
  const current = new Date(start);

  while (current <= end) {
    if (isBusinessDay(current, holidays)) {
      businessDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return businessDays;
}

export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diffTime = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
}

export function getAgingBucket(days: number): '0-30' | '31-60' | '61-90' | '91-120' | '120+' {
  if (days <= 30) return '0-30';
  if (days <= 60) return '31-60';
  if (days <= 90) return '61-90';
  if (days <= 120) return '91-120';
  return '120+';
}

export function isFollowUpOverdue(nextFollowUpDate?: string): boolean {
  if (!nextFollowUpDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return nextFollowUpDate < today;
}

export function daysOverdue(nextFollowUpDate?: string): number {
  if (!nextFollowUpDate) return 0;
  const today = new Date().toISOString().split('T')[0];
  if (nextFollowUpDate >= today) return 0;
  return calculateDaysBetween(nextFollowUpDate, today);
}
