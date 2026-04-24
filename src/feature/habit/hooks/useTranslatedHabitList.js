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

  const { data = habitList } = useQuery({
    queryKey: [
      'translatedHabits',
      i18n.language,
      habitList.map((habit) => habit.id).join(','),
      habitList.map((habit) => habit.name).join('|'),
    ],
    queryFn: () => translateHabitList(habitList, i18n.language),
    enabled: habitList.length > 0,
    staleTime: 1000 * 60 * 60,
  });

  return data;
}
