const COMMON_THEME = {
  title: '#414141',
  pointBg: '#FFFFFF4D',
  pointText: '#414141',
  duration: '#818181',
  description: '#414141',
};

const BACKGROUND_THEME = {
  1: {
    ...COMMON_THEME,
    nickname: '#3A8CA3',
  },
  2: {
    ...COMMON_THEME,
    nickname: '#578246',
  },
  3: {
    ...COMMON_THEME,
    nickname: '#C25578',
  },
  4: {
    ...COMMON_THEME,
    nickname: '#C18E1B',
  },
  default: {
    nickname: '#FFFFFF',
    title: '#FFFFFF',
    pointBg: '#00000080',
    pointText: '#FFFFFF',
    duration: '#EEEEEE',
    description: '#FFFFFF',
  },
};

export default function getBackgroundTheme(backgroundId) {
  return BACKGROUND_THEME[backgroundId] || BACKGROUND_THEME.default;
}
