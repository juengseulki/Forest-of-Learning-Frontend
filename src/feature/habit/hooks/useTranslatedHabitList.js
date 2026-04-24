import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { translate } from '@/api/translateApi.js';

async function translateHabitList(habitList, language) {
  if (language === 'ko') return habitList;

  return Promise.all(
    habitList.map(async (habit) => {
      if (!habit?.name) return habit;

      try {
        const translatedName = await translate(habit.name, language);

        return {
          ...habit,
          originalName: habit.name,
          name: translatedName || habit.name,
        };
      } catch {
        return habit;
      }
    })
  );
}

export function useTranslatedHabitList(habitList = []) {
  const { i18n } = useTranslation();

  const shouldTranslate = i18n.language !== 'ko' && habitList.length > 0;

  const habitStateKey = habitList
    .map((habit) => {
      const id = habit.id ?? habit.habitId;
      const name = habit.name ?? '';
      const completed = habit.todayRecord?.completed ?? false;

      return `${id}:${name}:${completed}`;
    })
    .join('|');

  const { data } = useQuery({
    queryKey: ['translatedHabits', i18n.language, habitStateKey],
    queryFn: () => translateHabitList(habitList, i18n.language),
    enabled: shouldTranslate,
    staleTime: 1000 * 60 * 60,
  });

  if (!shouldTranslate) {
    return habitList;
  }

  return data ?? habitList;
}
