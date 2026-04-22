export function toStudyId(id) {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getTodayDateString() {
  return formatLocalDate(new Date());
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
      habit.habitRecords?.find((record) => {
        if (!record?.date) return false;
        return record.date.slice(0, 10) === today;
      }) ?? null,
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
