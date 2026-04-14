export function toStudyId(id) {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

export function normalizeHabitListResponse(data) {
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  return [];
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
