export function useFocusPoint() {
  // 1차 보상 계산
  function calculateFirstReward(durationMinutes) {
    return {
      basePoint: 3,
      targetBonusPoint: durationMinutes,
    };
  }

  // 최종 보상 계산
  function calculateFinalReward(durationMinutes, actualMinutes) {
    const overtimeMinutes = Math.max(actualMinutes - durationMinutes, 0);

    return {
      overtimePoint: overtimeMinutes,
    };
  }

  return {
    calculateFirstReward,
    calculateFinalReward,
  };
}
