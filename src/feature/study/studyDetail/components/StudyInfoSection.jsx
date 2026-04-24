import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import pointIcon from '@/shared/images/icons/ic_point.png';
import '@/styles/StudyDetailPage.css';

import { useStudyPoint } from '../hooks/useStudyPoint.js';
import { translate } from '@/api/translateApi.js';

function toText(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  return fallback;
}

function StudyInfoSection({ study = {}, studyId }) {
  const { point } = useStudyPoint(studyId);
  const { i18n, t } = useTranslation();

  const originalName = toText(study.name, t('studyDefault'));
  const originalDescription = toText(study.description);

  const [translatedName, setTranslatedName] = useState('');
  const [translatedDescription, setTranslatedDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function translateStudyContent() {
      if (!originalName && !originalDescription) return;

      if (i18n.language === 'ko') {
        setTranslatedName('');
        setTranslatedDescription('');
        return;
      }

      try {
        setLoading(true);

        const [nameResult, descriptionResult] = await Promise.all([
          originalName ? translate(originalName, i18n.language) : '',
          originalDescription
            ? translate(originalDescription, i18n.language)
            : '',
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
  }, [i18n.language, originalName, originalDescription]);

  return (
    <div className="detail-left">
      <section className="detail-info">
        <h1>{translatedName || originalName}</h1>

        <div className="detail-field">
          <h3>{t('intro')}</h3>

          <p className="text-break">
            {translatedDescription || originalDescription}
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
