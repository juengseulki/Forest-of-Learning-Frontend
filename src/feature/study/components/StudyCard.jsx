import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../../styles/StudyCard.css';
import ic_point from '../../../shared/images/icons/ic_point.png';

import { addRecentStudy } from '../shared/utils/recentStudy.js';
import { useStudyDispatch } from '../../../contexts/StudyContext.jsx';

function StudyCard({
  id,
  nickname,
  name,
  description,
  duration,
  totalPoint,
  emojis,
  backgroundImage,
  theme,
}) {
  const navigate = useNavigate();
  const dispatch = useStudyDispatch();
  const { i18n, t } = useTranslation();

  const handleClick = () => {
    const updatedRecentStudies = addRecentStudy({ id });

    dispatch({
      type: 'SET_RECENT',
      payload: updatedRecentStudies,
    });

    navigate(`/studies/${id}`);
  };

  return (
    <div
      className="study-card"
      style={{
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.10),
            rgba(255, 255, 255, 0.18)
          ),
          url(${backgroundImage})
        `,
      }}
      onClick={handleClick}
    >
      <section className="card-header">
        <div className="header-top">
          <div className="title-group">
            <h2 className="title" style={{ color: theme?.title }}>
              <span style={{ color: theme?.nickname }}>{nickname}</span>
              {t('studyPossessive')} {name}
            </h2>

            <div className="point" style={{ backgroundColor: theme?.pointBg }}>
              <img
                className="point-icon"
                src={ic_point}
                alt={t('pointIconAlt')}
              />
              <p className="point-text" style={{ color: theme?.pointText }}>
                {totalPoint}P {t('earned')}
              </p>
            </div>
          </div>

          <p className="duration" style={{ color: theme?.duration }}>
            {duration}
            {i18n.language === 'zh-CN'
              ? ` ${t('dayProgress')}`
              : `${t('dayProgress')}`}
          </p>
        </div>

        <p
          className="description text-break"
          style={{ color: theme?.description }}
        >
          {description}
        </p>
      </section>

      <section className="card-footer">
        {[...emojis]
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
          .map((item) => (
            <div className="footer-content" key={item.emoji}>
              <p className="icon">{item.emoji}</p>
              <p className="icon-count">{item.count}</p>
            </div>
          ))}

        {emojis.length > 3 && (
          <div className="footer-content more">
            <p className="icon">+{emojis.length - 3}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default memo(StudyCard);
