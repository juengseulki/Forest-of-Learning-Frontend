// API 응답 -> UI 모델 변환

export function mapHabit(raw) {
  return {
    id: raw.id,
    name: raw.name,
    studyId: raw.studyId,
    createdAt: raw.createdAt,
  };
}

export function mapHabitList(rawList) {
  return (rawList ?? []).map(mapHabit);
}

// 기록용 -> { [habitId]: Set<dateString> } 형태로 변환
export function mapRecordsToCheckedMap(records) {
  return (records ?? []).reduce((acc, record) => {
    acc[record.habitId] = new Set(record.checkedDates ?? []);
    return acc;
  }, {});
}