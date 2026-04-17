export function toStudyId(id) {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

export function normalizeHabitListResponse(data) {
  const today = getTodayDateString();
  const items = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data)
      ? data
      : [];

  return items.map((habit) => ({
    ...habit,
    todayRecord:
      habit.habitRecords?.find((r) => r.date.startsWith(today)) ?? null,
  }));
}

export function extractStudyTitle(data) {
  return data?.title ?? data?.name ?? '';
}

export function createDraftInput() {
  return {
    id: Date.now() + Math.random(),
    name: '',
  };
}
