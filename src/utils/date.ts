/**
 * Format a datetime into a more human readable format
 * @param date parsable date string
 */
export function formatDateTime(date: string): string {
  return new Date(Date.parse(date)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
