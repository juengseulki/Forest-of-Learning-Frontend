export function calculateFirstReward(durationMinutes) {
  const basePoint = 3;
  const targetBonusPoint = Math.floor(durationMinutes / 10);

  return {
    basePoint,
    targetBonusPoint,
    firstRewardPoint: basePoint + targetBonusPoint,
  };
}

export function calculateFinalReward(durationMinutes, actualMinutes) {
  const overtimeMinutes = Math.max(actualMinutes - durationMinutes, 0);
  const overtimePoint = Math.floor(overtimeMinutes / 10);

  return {
    overtimeMinutes,
    overtimePoint,
    secondRewardPoint: overtimePoint,
  };
}

export function calculateFocusToastPoint(session, actualMinutes) {
  const firstPoint =
    (session?.basePoint ?? 0) + (session?.targetBonusPoint ?? 0);

  const finalReward = calculateFinalReward(
    session?.durationMinutes ?? 0,
    actualMinutes
  );

  const secondPoint = finalReward.overtimePoint;
  const totalPoint = firstPoint + secondPoint;

  return {
    firstPoint,
    secondPoint,
    totalPoint,
  };
}
