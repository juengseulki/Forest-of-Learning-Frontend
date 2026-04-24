import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import HabitRow from './HabitRow.jsx';
import { useHabitRecord } from '../hooks/useHabitRecord.js';
import { translate } from '@/api/translateApi.js';

function HabitRecord({ studyId }) {
  const { habits, weekDays, hasHabits, isLoading, isError } =
    useHabitRecord(studyId);

  const { i18n, t } = useTranslation();

  const [translatedMap, setTranslatedMap] = useState({});
  const [isTranslatingHabits, setIsTranslatingHabits] = useState(false);

  useEffect(() => {
    async function translateHabits() {
      if (!habits?.length || i18n.language === 'ko') {
        setTranslatedMap({});
        return;
      }

      try {
        setIsTranslatingHabits(true);

        const results = await Promise.all(
          habits.map(async (habit) => {
            const translatedText = await translate(
              habit.habitName,
              i18n.language
            );

            return {
              id: habit.habitId,
              text: translatedText,
            };
          })
        );

        const nextMap = results.reduce((acc, item) => {
          acc[item.id] = item.text;
          return acc;
        }, {});

        setTranslatedMap(nextMap);
      } catch (error) {
        console.error('습관 이름 번역 실패:', error);
        setTranslatedMap({});
      } finally {
        setIsTranslatingHabits(false);
      }
    }

    translateHabits();
  }, [i18n.language, habits]);

  if (isLoading) {
    return (
      <section className="detail-habit-section common-card">
        <h2>{t('habitRecordTitle')}</h2>
        <div className="empty-habit-container">
          <p>{t('loading')}</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="detail-habit-section common-card">
        <h2>{t('habitRecordTitle')}</h2>
        <div className="empty-habit-container">
          <p>{t('habitLoadFail')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="detail-habit-section common-card">
      <h2>{t('habitRecordTitle')}</h2>

      <div className="habit-scroll-container">
        {!hasHabits ? (
          <div className="empty-habit-container">
            <p>{t('emptyHabitTitle')}</p>
            <p>{t('emptyHabitDescription')}</p>
          </div>
        ) : (
          <div className="habit-wrapper">
            <div className="habit-weeks">
              <span>{t('mon')}</span>
              <span>{t('tue')}</span>
              <span>{t('wed')}</span>
              <span>{t('thu')}</span>
              <span>{t('fri')}</span>
              <span>{t('sat')}</span>
              <span>{t('sun')}</span>
            </div>

            <HabitRow
              habits={habits}
              weekDays={weekDays}
              translatedMap={translatedMap}
            />
          </div>
        )}
      </div>

      {isTranslatingHabits && (
        <p className="translate-loading-text habit-translate-loading-text">
          {t('translating')}
        </p>
      )}
    </section>
  );
}

export default HabitRecord;
