export const ARCHIVED_RETENTION_DAYS = 30;

export function archivedRetentionCutoffDate(now: Date = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - ARCHIVED_RETENTION_DAYS);
  return cutoff;
}
