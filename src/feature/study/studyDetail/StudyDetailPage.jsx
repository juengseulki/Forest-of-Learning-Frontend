import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../../styles/StudyDetailPage.css';
import '../../../styles/global.css';
import StudyInfoSection from './components/StudyInfoSection.jsx';
import StudyActionButtonGroup from './components/actionSection/StudyActionButtonGroup.jsx';
import StudyLinkGroup from './components/actionSection/StudyLinkGroup.jsx';
import EmojiSection from './components/emoji/EmojiSection.jsx';
import HabitRecord from './components/HabitRecord.jsx';
import StudyPasswordModal from '../shared/modal/StudyPasswordModal.jsx';
import StudyConfirmModal from '../shared/modal/StudyConfirmModal.jsx';
import StudyRecordModal from '../shared/modal/StudyRecordModal.jsx';
import { useStudyDetail } from './hooks/useStudyDetail.jsx';
import { translate } from '../../../api/translateApi.js';

function StudyDetailPage() {
  const { studyId } = useParams();
  const { i18n, t } = useTranslation();
  const [translatedStudyName, setTranslatedStudyName] = useState('');

  const {
    study,
    password,
    isSubmitting,
    isPasswordModalOpen,
    isDeleteConfirmModalOpen,
    isRecordModalOpen,
    handleRequirePassword,
    handleClosePasswordModal,
    handleCloseDeleteConfirmModal,
    handleChangePassword,
    handleSubmitPassword,
    handleConfirmDelete,
    handleCloseRecordModal,
    getActionLabel,
  } = useStudyDetail(studyId);

  useEffect(() => {
    async function translateTitle() {
      if (!study?.name) return;

      if (i18n.language === 'ko') {
        setTranslatedStudyName('');
        return;
      }

      try {
        const result = await translate(study.name, i18n.language);
        setTranslatedStudyName(result);
      } catch (error) {
        console.error('스터디 제목 번역 실패:', error);
        setTranslatedStudyName('');
      }
    }

    translateTitle();
  }, [i18n.language, study?.name]);

  return (
    <div className="detail-wrapper">
      <div className="detail-container common-panel">
        <section className="detail-top-section">
          <div className="detail-left">
            <EmojiSection studyId={id} />
            <StudyInfoSection study={study} studyId={id} />
          </div>

          <div className="detail-right">
            <StudyActionButtonGroup
              onEditClick={() => handleRequirePassword('edit')}
              onDeleteClick={() => handleRequirePassword('delete')}
              onRecordClick={() => handleRequirePassword('record')}
              study={study}
            />

            <StudyLinkGroup
              onHabitClick={() => handleRequirePassword('habit')}
              onFocusClick={() => handleRequirePassword('focus')}
            />
          </div>
        </section>

        <HabitRecord studyId={id} />
      </div>

      <StudyPasswordModal
        isOpen={isPasswordModalOpen}
        studyName={translatedStudyName || study.name}
        password={password}
        isSubmitting={isSubmitting}
        onChangePassword={handleChangePassword}
        onClose={handleClosePasswordModal}
        onSubmit={handleSubmitPassword}
        actionLabel={getActionLabel()}
        description={t('passwordRequired')}
      />

      <StudyConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        title={t('deleteStudyTitle')}
        description={t('deleteStudyDescription')}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        onClose={handleCloseDeleteConfirmModal}
        onConfirm={handleConfirmDelete}
      />

      <StudyRecordModal
        isOpen={isRecordModalOpen}
        title={t('pointRecord')}
        closeText={t('close')}
        onClose={handleCloseRecordModal}
        studyId={Number(studyId)}
      />
    </div>
  );
}

export default StudyDetailPage;
