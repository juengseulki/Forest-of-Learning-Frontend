import '../styles/reset.css';
import '../styles/habit.css';

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import HabitForm from '../feature/habit/components/HabitForm.jsx';
import HabitPageHeader from '../feature/habit/components/HabitPageHeader.jsx';
import HabitCard from '../feature/habit/components/HabitCard.jsx';

import { useCurrentTime } from '../feature/habit/hooks/useCurrentTime.js';
import { useHabitQuery } from '../feature/habit/hooks/useHabitQuery.js';
import { useHabitAction } from '../feature/habit/hooks/useHabitAction.js';
import { useHabitForm } from '../feature/habit/hooks/useHabitForm.js';
import { useStudyTitle } from '../feature/habit/hooks/useStudyTitle.js';
import { useTranslatedHabitList } from '../feature/habit/hooks/useTranslatedHabitList.js';
import { useTranslatedStudyTitle } from '../feature/habit/hooks/useTranslatedStudyTitle.js';

import { formatHabitTime } from '../feature/habit/utils/formatHabitTime.js';
import { toStudyId } from '../feature/habit/utils/habitUtils.js';

function HabitPage() {
  const { studyId, habitId } = useParams();
  const parsedStudyId = toStudyId(studyId);

  const now = useCurrentTime();
  const formattedTime = formatHabitTime(now);

  const studyTitle = useStudyTitle(parsedStudyId);
  const displayStudyTitle = useTranslatedStudyTitle(studyTitle);

  const {
    data: habitList = [],
    isLoading,
    isError,
    refetch,
  } = useHabitQuery(parsedStudyId);

  const translatedHabitList = useTranslatedHabitList(habitList);
  const { toggleHabit } = useHabitAction(parsedStudyId);

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
    onAfterCreate: refetch,
    onAfterDelete: refetch,
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

  return (
    <section className="habit-page common-panel-lg">
      <main className="habit-home">
        <HabitPageHeader
          studyId={parsedStudyId}
          studyTitle={displayStudyTitle}
          formattedTime={formattedTime}
        />

        <HabitCard
          habitList={translatedHabitList}
          isLoading={isLoading}
          isError={isError}
          onOpenModal={openModal}
          onToggleHabit={toggleHabit}
        />
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
