export function filterStudies(studies, keyword) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) return [...studies];

  return studies.filter((study) => {
    const nickname = study.nickname?.toLowerCase() ?? '';
    const name = study.name?.toLowerCase() ?? '';
    const description = study.description?.toLowerCase() ?? '';

    return (
      nickname.includes(normalizedKeyword) ||
      name.includes(normalizedKeyword) ||
      description.includes(normalizedKeyword)
    );
  });
}

export function sortStudies(studies, order) {
  const result = [...studies];

  switch (order) {
    case 'oldest':
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;

    case 'pointDesc':
      result.sort((a, b) => (b.point ?? 0) - (a.point ?? 0));
      break;

    case 'pointAsc':
      result.sort((a, b) => (a.point ?? 0) - (b.point ?? 0));
      break;

    case 'latest':
    default:
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }

  return result;
}

export function getFilteredStudies(studies, keyword, order) {
  const filtered = filterStudies(studies, keyword);
  return sortStudies(filtered, order);
}

export function getVisibleCount(listPage, listLimit) {
  return listPage * listLimit;
}

export function getHasMore(totalCount, visibleCount) {
  return totalCount > visibleCount;
}
