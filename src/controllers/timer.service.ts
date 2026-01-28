export function getTimeLeft(progress) {
  const QUESTION_TIME = 30; // seconds

  const start = new Date(progress.currentQuestionStartTime).getTime();
  const now = Date.now();

  let extraTime = 0;

  if (
    progress.lifelines.freeze?.used &&
    new Date(progress.lifelines.freeze.endsAt).getTime() > now
  ) {
    extraTime += 60;
  }

  const elapsed = (now - start) / 1000;
  return Math.max(0, Math.floor(QUESTION_TIME + extraTime - elapsed));
}
