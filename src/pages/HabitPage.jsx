import '../styles/reset.css';
import '../styles/habit.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import arrowRightIcon from '../shared/images/icons/ic_arrow_right.svg';

import HabitItem from '../feature/habit/components/HabitItem.jsx';
import HabitForm from '../feature/habit/components/HabitForm.jsx';

import { useCurrentTime } from '../feature/habit/hooks/useCurrentTime.js';
import { useStudyTitle } from '../feature/habit/hooks/useStudyTitle.js';
import { useHabitList } from '../feature/habit/hooks/useHabitList.js';
import { useHabitForm } from '../feature/habit/hooks/useHabitForm.js';

import { formatHabitTime } from '../feature/habit/utils/formatHabitTime.js';
import { toStudyId } from '../feature/habit/utils/habitUtils.js';
import { translate } from '../api/translateApi.js';

function HabitPage() {
  const navigate = useNavigate();
  const { studyId, habitId } = useParams();
  const { t, i18n } = useTranslation();

  const parsedStudyId = toStudyId(studyId);

  const now = useCurrentTime();
  const formattedTime = formatHabitTime(now);

  const studyTitle = useStudyTitle(parsedStudyId);
  const [translatedStudyTitle, setTranslatedStudyTitle] = useState('');

  const {
    habitList,
    isLoading,
    errorMessage,
    fetchHabitList,
    toggleHabit,
    removeHabitLocally,
  } = useHabitList(parsedStudyId);

  const {
    draftHabitList,
    draftInputs,
    isModalOpen,
    isSubmitting,
    openModal,
    closeModal,
    addInputRow,
    changeInputRow,
    deleteInputRow,
    deleteDraftHabit,
    submitHabitList,
  } = useHabitForm({
    studyId: parsedStudyId,
    habitList,
    onAfterCreate: fetchHabitList,
    onAfterDelete: removeHabitLocally,
  });

  useEffect(() => {
    if (!habitId || habitList.length === 0) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(`habit-${habitId}`);
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [habitId, habitList]);

  useEffect(() => {
    async function translateStudyName() {
      if (!studyTitle) return;

      if (i18n.language === 'ko') {
        setTranslatedStudyTitle('');
        return;
      }

      try {
        const result = await translate(studyTitle, i18n.language);
        setTranslatedStudyTitle(result);
      } catch (error) {
        console.error('습관 페이지 스터디 이름 번역 실패:', error);
        setTranslatedStudyTitle('');
      }
    }

    translateStudyName();
  }, [i18n.language, studyTitle]);

  return (
    <section className="habit-page common-panel-lg">
      <main className="habit-home">
        <header className="habit-home__header">
          <div className="habit-home__top">
            <h1
              className="habit-home__title"
              onClick={() => {
                if (!parsedStudyId) return;
                navigate(`/studies/${parsedStudyId}`);
              }}
            >
              {translatedStudyTitle || studyTitle || t('studyDefault')}
            </h1>

            <div className="habit-home__nav">
              <button
                type="button"
                className="habit-home__nav-btn common-action-btn"
                onClick={() => {
                  if (!parsedStudyId) return;
                  navigate(`/studies/${parsedStudyId}/focus`);
                }}
              >
                <span className="habit-home__nav-text">{t('todayFocus')}</span>
                <img
                  src={arrowRightIcon}
                  alt={t('arrowRight')}
                  className="common-action-icon habit-home__nav-icon"
                />
              </button>

              <button
                type="button"
                className="habit-home__nav-btn habit-home__nav-btn--small common-action-btn"
                onClick={() => navigate('/')}
              >
                <span className="habit-home__nav-text">{t('home')}</span>
                <img
                  src={arrowRightIcon}
                  alt={t('arrowRight')}
                  className="common-action-icon habit-home__nav-icon"
                />
              </button>
            </div>
          </div>

          <div className="habit-home__time">
            <span className="habit-home__time-label">{t('currentTime')}</span>
            <span className="habit-home__time-value common-point-box">
              {formattedTime}
            </span>
          </div>
        </header>

        <section className="habit-card common-card common-panel-md">
          <div className="habit-card__header">
            <div className="habit-card__header-left" />
            <h2 className="habit-card__title">{t('todayHabit')}</h2>
            <button
              type="button"
              className="habit-card__edit"
              onClick={openModal}
            >
              {t('editList')}
            </button>
          </div>

          <div className="habit-list">
            {isLoading && habitList.length === 0 ? (
              <div className="habit-empty">
                <p className="habit-empty__title">{t('loading')}</p>
              </div>
            ) : errorMessage ? (
              <div className="habit-empty">
                <p className="habit-empty__title">{errorMessage}</p>
              </div>
            ) : habitList.length === 0 ? (
              <div className="habit-empty">
                <p className="habit-empty__title">{t('noHabit')}</p>
                <p className="habit-empty__desc">{t('createHabitGuide')}</p>
              </div>
            ) : (
              habitList.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <HabitForm
        isOpen={isModalOpen}
        draftHabitList={draftHabitList}
        draftInputs={draftInputs}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onDeleteDraftHabit={deleteDraftHabit}
        onAddInputRow={addInputRow}
        onChangeInputRow={changeInputRow}
        onDeleteInputRow={deleteInputRow}
        onSubmit={submitHabitList}
      />
    </section>
  );
}

export default HabitPage;
