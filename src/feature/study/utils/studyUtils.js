export function getDaysFrom(createdAt) {
  return (
    Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)) + 1
  );
}

export function findStudyEmoji(emojiItems, studyId) {
  return emojiItems.find((emojiItem) => emojiItem.studyId === studyId);
}

export function findBackground(backgrounds, backgroundId) {
  return backgrounds.find((bg) => bg.id === backgroundId);
}

export function getStudyCardProps({
  item,
  point,
  backgrounds,
  emojiItems,
  getBackgroundTheme,
}) {
  const emoji = findStudyEmoji(emojiItems, item.id);
  const background = findBackground(backgrounds, item.background.id);
  const theme = getBackgroundTheme(item.background?.id);

  return {
    nickname: item.nickname,
    name: item.name,
    description: item.description,
    duration: getDaysFrom(item.createdAt),
    totalPoint: point.studyId === item.id ? point.totalPoint : 0,
    emojis: emoji?.emojis ?? [],
    backgroundImage: background?.imageUrl,
    theme,
  };
}
