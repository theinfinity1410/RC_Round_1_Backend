export function getRemainingTime(progress) {
  if (!progress.testStartTime) return 0;

  const start = new Date(progress.testStartTime).getTime();
  const now = Date.now();

  const elapsed = Math.floor((now - start) / 1000);

  const remaining = progress.totalDuration - elapsed;

  return Math.max(0, remaining);
}
