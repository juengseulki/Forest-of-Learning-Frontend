import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import icSearch from '@/shared/images/icons/ic_search.png';
import icSelectArrow from '@/shared/components/icons/icon/ic_select_arrow.png';

const ORDER_OPTIONS = [
  { value: 'latest', labelKey: 'latest' },
  { value: 'oldest', labelKey: 'oldest' },
  { value: 'pointDesc', labelKey: 'pointDesc' },
  { value: 'pointAsc', labelKey: 'pointAsc' },
];

function StudySearchFilter({ keyword, onChangeKeyword, order, onChangeOrder }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    const selected = ORDER_OPTIONS.find((option) => option.value === order);
    return t(selected?.labelKey || 'latest');
  }, [order, t]);

  function handleSelect(value) {
    onChangeOrder(value);
    setIsOpen(false);
  }

  return (
    <div className="filter">
      <div className="search-container common-field">
        <img src={icSearch} alt={t('search')} />

        <input
          className="common-field-control"
          placeholder={t('search')}
          value={keyword}
          onChange={(e) => onChangeKeyword(e.target.value)}
        />
      </div>

      <div className={`select ${isOpen ? 'active' : ''}`}>
        <button
          type="button"
          className="label"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedLabel}
          <img src={icSelectArrow} alt="" />
        </button>

        <ul className="optionList">
          {ORDER_OPTIONS.map((option) => (
            <li
              key={option.value}
              className="optionItem"
              onClick={() => handleSelect(option.value)}
            >
              {t(option.labelKey)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudySearchFilter;
