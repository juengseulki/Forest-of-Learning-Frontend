import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translate } from '../../../api/translateApi';

function HabitItem({ habit, onToggle }) {
  const { i18n } = useTranslation();
  const [translatedName, setTranslatedName] = useState('');

  useEffect(() => {
    async function translateHabitName() {
      if (!habit?.name) return;

      if (i18n.language === 'ko') {
        setTranslatedName('');
        return;
      }

      try {
        const result = await translate(habit.name, i18n.language);
        setTranslatedName(result);
      } catch (error) {
        console.error('습관 이름 번역 실패:', error);
        setTranslatedName('');
      }
    }

    translateHabitName();
  }, [i18n.language, habit?.name]);

  return (
    <button
      id={`habit-${habit.id}`}
      type="button"
      className={`habit-item ${
        habit.todayRecord?.completed ? 'habit-item--done' : ''
      }`}
      onClick={() => onToggle(habit)}
    >
      {translatedName || habit.name}
    </button>
  );
}

export default HabitItem;
