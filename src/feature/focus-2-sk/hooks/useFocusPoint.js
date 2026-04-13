export function useFocusPoint() {
  // 1차 보상 계산: 설정시간 달성 시
  function calculateFirstReward(durationMinutes) {
    const basePoint = 3;
    const targetBonusPoint = Math.floor(durationMinutes / 10);

    return {
      basePoint,
      targetBonusPoint,
      firstRewardPoint: basePoint + targetBonusPoint,
    };
  }

  // 2차 보상 계산: 종료 시 초과시간 보상
  function calculateFinalReward(durationMinutes, actualMinutes) {
    const overtimeMinutes = Math.max(actualMinutes - durationMinutes, 0);
    const overtimePoint = Math.floor(overtimeMinutes / 10);

    return {
      overtimeMinutes,
      overtimePoint,
      secondRewardPoint: overtimePoint,
    };
  }

  return {
    calculateFirstReward,
    calculateFinalReward,
  };
}
