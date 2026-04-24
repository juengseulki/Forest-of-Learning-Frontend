import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import '@/styles/StudyCard.css';
import ic_point from '@/shared/images/icons/ic_point.png';

function toText(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return value;
  return fallback;
}

function StudyCard({
  id,
  nickname,
  name,
  description,
  duration,
  totalPoint,
  emojis = [],
  backgroundImage,
  theme,
  onClick,
}) {
  const { i18n, t } = useTranslation();

  const displayNickname = toText(nickname);
  const displayName = toText(name);
  const displayDescription = toText(description);
  const displayDuration = toText(duration);

  const safeEmojis = Array.isArray(emojis) ? emojis : [];

  const handleClick = () => {
    onClick?.(id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleClick();
  };

  return (
    <div
      role="button"
      tabIndex={0}
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
      onKeyDown={handleKeyDown}
    >
      <section className="card-header">
        <div className="header-top">
          <div className="title-group">
            <h2 className="title" style={{ color: theme?.title }}>
              <span style={{ color: theme?.nickname }}>{displayNickname}</span>
              {t('studyPossessive')} {displayName}
            </h2>

            <div className="point" style={{ backgroundColor: theme?.pointBg }}>
              <img
                className="point-icon"
                src={ic_point}
                alt={t('pointIconAlt')}
              />

              <p className="point-text" style={{ color: theme?.pointText }}>
                {totalPoint ?? 0}P {t('earned')}
              </p>
            </div>
          </div>

          <p className="duration" style={{ color: theme?.duration }}>
            {displayDuration}
            {i18n.language === 'zh-CN'
              ? ` ${t('dayProgress')}`
              : t('dayProgress')}
          </p>
        </div>

        <p
          className="description text-break"
          style={{ color: theme?.description }}
        >
          {displayDescription}
        </p>
      </section>

      <section className="card-footer">
        {[...safeEmojis]
          .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
          .slice(0, 3)
          .map((item) => (
            <div className="footer-content" key={item.id ?? item.emoji}>
              <p className="icon">{item.emoji}</p>
              <p className="icon-count">{item.count ?? 0}</p>
            </div>
          ))}

        {safeEmojis.length > 3 && (
          <div className="footer-content more">
            <p className="icon">+{safeEmojis.length - 3}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default memo(StudyCard);
