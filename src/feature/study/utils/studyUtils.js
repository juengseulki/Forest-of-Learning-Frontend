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

function resolveTotalPoint(point) {
  if (typeof point === 'number') return point;
  return point?.totalPoint ?? 0;
}

function resolveEmojis(item) {
  return [...(item.emojiReactions ?? item.emojis ?? item.reactions ?? [])].sort(
    (a, b) => Number(b.count ?? 0) - Number(a.count ?? 0)
  );
}

export function getStudyCardProps({ item, getBackgroundTheme }) {
  const theme = getBackgroundTheme(item.background?.id);

  return {
    nickname: item.nickname,
    name: item.name,
    description: item.description,
    duration: getDaysFrom(item.createdAt),
    totalPoint: item.point ?? 0,

    emojis:
      item.emojiReactions?.map((e) => ({
        emoji: e.emoji,
        count: e.count,
      })) ?? [],

    backgroundImage: resolveBackgroundImage(item.background?.imageUrl),
    theme,
  };
}
