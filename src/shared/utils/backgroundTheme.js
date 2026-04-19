const COMMON_THEME = {
  title: '#414141',
  pointBg: '#FFFFFF4D',
  pointText: '#414141',
  duration: '#818181',
  description: '#414141',
};

const IMAGE_LIGHT_THEME = {
  nickname: '#3E6B47',
  title: '#2F3A33',
  pointBg: '#FFFFFFB3',
  pointText: '#2F3A33',
  duration: '#66736D',
  description: '#3F4A44',
};

const IMAGE_DARK_THEME = {
  nickname: '#FFFFFF',
  title: '#FFFFFF',
  pointBg: '#00000066',
  pointText: '#FFFFFF',
  duration: '#EEEEEE',
  description: '#FFFFFF',
};

// 몬스테라 전용: 너무 검지도 너무 희지도 않게
const IMAGE_MONSTERA_THEME = {
  nickname: '#4e6d4d',
  title: '#7caf75',
  pointBg: '#00000055',
  pointText: '#ffffff',
  duration: '#aae6ad',
  description: '#abb87b',
};

const BACKGROUND_THEME = {
  1: { ...COMMON_THEME, nickname: '#3A8CA3' },
  2: { ...COMMON_THEME, nickname: '#578246' },
  3: { ...COMMON_THEME, nickname: '#C25578' },
  4: { ...COMMON_THEME, nickname: '#C18E1B' },
};

export default function getBackgroundTheme(backgroundId) {
  if (backgroundId >= 5) {
    // 노트북
    if (backgroundId === 5) {
      return IMAGE_DARK_THEME;
    }

    // 몬스테라
    if (backgroundId === 8) {
      return IMAGE_MONSTERA_THEME;
    }

    // 나머지 이미지
    return IMAGE_LIGHT_THEME;
  }

  return BACKGROUND_THEME[backgroundId] || IMAGE_LIGHT_THEME;
}
