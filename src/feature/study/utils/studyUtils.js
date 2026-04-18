const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function getDaysFrom(createdAt) {
  return (
    Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)) + 1
  );
}

function resolveBackgroundImage(imageUrl) {
  if (!imageUrl) return '';

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
}

export function getStudyCardProps({ item, getBackgroundTheme }) {
  const theme = getBackgroundTheme(item.background?.id);

  return {
    nickname: item.nickname,
    name: item.name,
    description: item.description,
    duration: getDaysFrom(item.createdAt),
    totalPoint: item.point ?? 0,
    emojis: item.emojis ?? [],
    backgroundImage: resolveBackgroundImage(item.background?.imageUrl),
    theme,
  };
}
