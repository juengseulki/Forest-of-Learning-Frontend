import EmojiSection from './emoji/EmojiSection.jsx';
import StudyInfoSection from './StudyInfoSection.jsx';
import StudyActionButtonGroup from './actionSection/StudyActionButtonGroup.jsx';
import StudyLinkGroup from './actionSection/StudyLinkGroup.jsx';
import HabitRecord from './HabitRecord.jsx';

function StudyDetailContent({ studyId, study, onRequirePassword }) {
  return (
    <div className="detail-container common-panel">
      <section className="detail-top-section">
        <div className="detail-left">
          <EmojiSection studyId={studyId} />
          <StudyInfoSection study={study} studyId={studyId} />
        </div>

        <div className="detail-right">
          <StudyActionButtonGroup
            onEditClick={() => onRequirePassword('edit')}
            onDeleteClick={() => onRequirePassword('delete')}
            onRecordClick={() => onRequirePassword('record')}
            study={study}
          />

          <StudyLinkGroup
            onHabitClick={() => onRequirePassword('habit')}
            onFocusClick={() => onRequirePassword('focus')}
          />
        </div>
      </section>

      <HabitRecord studyId={studyId} />
    </div>
  );
}

export default StudyDetailContent;
