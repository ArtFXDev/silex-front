/**
 * Format a datetime into a more human readable format
 * @param date parsable date string
 */
export function formatDateTime(date: string | number): string {
  return new Date(
    typeof date === "string" ? Date.parse(date) : date
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

/**
 * Converts seconds to D H M S
 * Taken from: https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
 * @param seconds
 * @returns
 */
export function secondsToDhms(seconds: number): string {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + " d " : "";
  const hDisplay = h > 0 ? h + " h " : "";
  const mDisplay = m > 0 ? m + " m " : "";
  const sDisplay = s > 0 ? s + " s" : "";

  return dDisplay + hDisplay + mDisplay + sDisplay;
}

export const dateDiffDays = (date1: Date, date2: Date): number => {
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
};
