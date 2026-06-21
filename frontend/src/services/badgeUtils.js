export function getCurrentBadge(value, badges) {
  return badges.filter((badge) => value >= badge).pop();
}

export function getNextBadge(value, badges) {
  return badges.find((badge) => badge > value);
}

export function getRemaining(value, badges) {
  const nextBadge = getNextBadge(value, badges);

  if (!nextBadge) return 0;

  return nextBadge - value;
}

export function getProgress(value, badges) {
  const currentBadge =
    getCurrentBadge(value, badges) || 0;

  const nextBadge =
    getNextBadge(value, badges);

  if (!nextBadge) return 100;

  return (
    ((value - currentBadge) /
      (nextBadge - currentBadge)) *
    100
  );
}