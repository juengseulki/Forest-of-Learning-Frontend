const RECENT_STUDIES_KEY = 'recentStudies';
const MAX_RECENT_STUDIES = 5;

export function getRecentStudies() {
  try {
    const stored = localStorage.getItem(RECENT_STUDIES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('최근 조회 스터디를 불러오지 못했습니다.', error);
    return [];
  }
}

export function addRecentStudy(study) {
  try {
    const current = getRecentStudies();

    const filtered = current.filter((item) => item.id !== study.id);
    const updated = [study, ...filtered].slice(0, MAX_RECENT_STUDIES);

    localStorage.setItem(RECENT_STUDIES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('최근 조회 스터디를 저장하지 못했습니다.', error);
    return getRecentStudies();
  }
}

export function clearRecentStudies() {
  try {
    localStorage.removeItem(RECENT_STUDIES_KEY);
  } catch (error) {
    console.error('최근 조회 스터디를 비우지 못했습니다.', error);
  }
}
