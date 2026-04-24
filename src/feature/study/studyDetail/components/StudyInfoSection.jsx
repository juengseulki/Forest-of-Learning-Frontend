import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import pointIcon from '@/shared/images/icons/ic_point.png';
import '@/styles/StudyDetailPage.css';
import { useStudyPoint } from '../hooks/useStudyPoint.js';
import { translate } from '@/api/translateApi.js';

function StudyInfoSection({ study, studyId }) {
  const { point } = useStudyPoint(studyId);
  const { i18n, t } = useTranslation();

  const [translatedName, setTranslatedName] = useState('');
  const [translatedDescription, setTranslatedDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function translateStudyContent() {
      if (!study) return;

      if (i18n.language === 'ko') {
        setTranslatedName('');
        setTranslatedDescription('');
        return;
      }

      try {
        setLoading(true);

        const [nameResult, descriptionResult] = await Promise.all([
          translate(study.name, i18n.language),
          translate(study.description, i18n.language),
        ]);

        setTranslatedName(nameResult);
        setTranslatedDescription(descriptionResult);
      } catch (error) {
        console.error('스터디 번역 실패:', error);
        setTranslatedName('');
        setTranslatedDescription('');
      } finally {
        setLoading(false);
      }
    }

    translateStudyContent();
  }, [i18n.language, study]);

  return (
    <div className="detail-left">
      <section className="detail-info">
        <h1>{translatedName || study.name}</h1>

        <div className="detail-field">
          <h3>{t('intro')}</h3>

          <p className="text-break">
            {translatedDescription || study.description}
          </p>

          {loading && (
            <p className="translate-loading-text">{t('translating')}</p>
          )}
        </div>
      </section>

      <div className="detail-point-group">
        <h3 className="detail-point-title">{t('earnedPoint')}</h3>
        <div className="detail-point common-point-box">
          <img src={pointIcon} alt={t('pointIconAlt')} />
          {point}P {t('earned')}
        </div>
      </div>
    </div>
  );
}

export default StudyInfoSection;
