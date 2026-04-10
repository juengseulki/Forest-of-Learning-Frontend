const BACKGROUND_THEME = {
  1: {
    nickname: '#3A8CA3',
    title: '#414141',
    pointBg: '#FFFFFF4D',
    pointText: '#414141',
    duration: '#818181',
    description: '#414141',
  },
  2: {
    nickname: '#578246',
    title: '#414141',
    pointBg: '#FFFFFF4D',
    pointText: '#414141',
    duration: '#818181',
    description: '#414141',
  },
  3: {
    nickname: '#C25578',
    title: '#414141',
    pointBg: '#FFFFFF4D',
    pointText: '#414141',
    duration: '#818181',
    description: '#414141',
  },
  4: {
    nickname: '#C18E1B',
    title: '#414141',
    pointBg: '#FFFFFF4D',
    pointText: '#414141',
    duration: '#818181',
    description: '#414141',
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
