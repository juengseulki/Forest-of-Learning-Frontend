// 습관 목록 매핑
export function mapHabitList(rawItems) {
  return (rawItems ?? []).map(item => ({
    id: item.id,
    name: item.name,
    isEnded: item.isEnded,
    // 오늘 기록이 포함되어 온다면 활용할 수 있습니다.
    todayCompleted: item.todayRecord?.completed ?? false, 
  }));
}

// 습관 기록 매핑 (객체 형태 대응)
export function mapRecordsToCheckedMap(records) {
  return (records ?? []).reduce((acc, record) => {
    // record.dates가 { '2026-04-07': true, '2026-04-08': false } 형태임
    const completedDates = new Set();
    
    Object.entries(record.dates ?? {}).forEach(([date, isCompleted]) => {
      if (isCompleted) {
        completedDates.add(date);
      }
    });

    acc[record.habitId] = completedDates;
    return acc;
  }, {});
}