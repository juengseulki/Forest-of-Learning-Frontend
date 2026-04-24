import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/common/Input.jsx';
import '../../../styles/StudyForm.css';
import ic_pow from '../../../images/icon/ic_pow.svg';
import { createStudy, updateStudy } from '../../../api/studyApi.js';
import { getBackgrounds } from '../../../api/backgroundApi.js';
import { translate } from '../../../api/translateApi.js';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const MAX_DESC_LENGTH = 200;

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return '';

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
}

function StudyForm({ isEditMode = false, initialData = {}, onValidSubmit }) {
  // api중복호불 방지용 로딩 추가
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { studyId } = useParams();
  const { t, i18n } = useTranslation();

  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);

  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [errors, setErrors] = useState({});

  const nicknameRef = useRef(null);
  const nameRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);

  const handleDescriptionChange = (e) => {
    const { value } = e.target;

    if (value.length <= MAX_DESC_LENGTH) {
      setDescription(value);
    }
  };
  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const data = await getBackgrounds();
        const items = data?.items ?? [];

        setBackgrounds(items);

        if (!isEditMode && items.length > 0) {
          setSelectedBackground(items[0].id);
        }
      } catch (error) {
        console.error('배경 목록 조회 실패:', error);
        setBackgrounds([]);
      }
    };

    fetchBackgrounds();
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode || !initialData || Object.keys(initialData).length === 0) {
      return;
    }

    async function applyInitialData() {
      const originalNickname = initialData.nickname ?? '';
      const originalName = initialData.name ?? '';
      const originalDescription = initialData.description ?? '';

      if (i18n.language === 'ko') {
        setNickname(originalNickname);
        setName(originalName);
        setDescription(originalDescription);
        setSelectedBackground(initialData.background?.id ?? null);
        return;
      }

      try {
        const [translatedNickname, translatedName, translatedDescription] =
          await Promise.all([
            originalNickname ? translate(originalNickname, i18n.language) : '',
            originalName ? translate(originalName, i18n.language) : '',
            originalDescription
              ? translate(originalDescription, i18n.language)
              : '',
          ]);

        setNickname(translatedNickname || originalNickname);
        setName(translatedName || originalName);
        setDescription(translatedDescription || originalDescription);
        setSelectedBackground(initialData.background?.id ?? null);
      } catch (error) {
        console.error('수정 폼 초기 데이터 번역 실패:', error);
        setNickname(originalNickname);
        setName(originalName);
        setDescription(originalDescription);
        setSelectedBackground(initialData.background?.id ?? null);
      }
    }

    applyInitialData();
  }, [isEditMode, initialData, i18n.language]);

  const submitButtonClick = async () => {
    if (isLoading) return;
    const newErrors = {};

    if (!nickname.trim()) newErrors.nickname = t('errorNicknameRequired');
    if (!name.trim()) newErrors.name = t('errorStudyNameRequired');
    if (!selectedBackground) {
      newErrors.background = t('errorBackgroundRequired');
    }

    if (!isEditMode) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{5,20}$/;

      if (!password) {
        newErrors.password = t('errorPasswordRequired');
      } else if (!passwordRegex.test(password)) {
        newErrors.password = t('errorPasswordInvalid');
      }

      if (password !== passwordCheck) {
        newErrors.passwordCheck = t('errorPasswordMismatch');
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.nickname) {
        nicknameRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
        nicknameRef.current?.focus();
      } else if (newErrors.name) {
        nameRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
        nameRef.current?.focus();
      } else if (newErrors.password) {
        passwordRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
        passwordRef.current?.focus();
      } else if (newErrors.passwordCheck) {
        passwordCheckRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
        passwordCheckRef.current?.focus();
      }
    }

    const formData = {
      nickname,
      name,
      description,
      backgroundId: Number(selectedBackground),
    };

    setIsLoading(true);

    if (onValidSubmit) {
      onValidSubmit(formData);
      return;
    }

    try {
      setIsLoading(true);
      if (isEditMode) {
        await updateStudy(studyId, formData);
        navigate(`/studies/${studyId}`);
      } else {
        const result = await createStudy({
          ...formData,
          password,
          passwordConfirm: passwordCheck,
        });

        navigate(`/studies/${result.id}`);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container common-panel-md">
      <div className="form-wrapper">
        <p className="form-title">
          {isEditMode ? t('studyEdit') : t('studyCreate')}
        </p>

        <Input
          ref={nicknameRef}
          labelName={t('nickname')}
          placeholder={t('nicknamePlaceholder')}
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setErrors((prev) => ({ ...prev, nickname: '' }));
          }}
          error={errors.nickname}
        />

        <Input
          ref={nameRef}
          labelName={t('studyName')}
          placeholder={t('studyNamePlaceholder')}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: '' }));
          }}
          error={errors.name}
        />

        <div className="form-wrapper">
          <div className="description-header">
            <label className="input-label">{t('descriptionLabel')}</label>
            <span
              className={`char-count ${description.length >= MAX_DESC_LENGTH ? 'limit' : ''}`}
            >
              {description.length} / {MAX_DESC_LENGTH}
            </span>
          </div>
          <textarea
            className="textarea-wrapper"
            placeholder={t('descriptionPlaceholder')}
            value={description}
            onChange={handleDescriptionChange}
            maxLength={MAX_DESC_LENGTH}
          />
        </div>

        <div className="form-wrapper">
          <label className="input-label">{t('selectBackground')}</label>
          <div className="background-grid">
            {backgrounds.map((background) => {
              const isSelected = selectedBackground === background.id;

              return (
                <div
                  key={background.id}
                  className={`background-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedBackground(background.id)}
                >
                  <img
                    src={resolveImageUrl(background.imageUrl)}
                    alt={background.name}
                    className="background-image"
                  />
                  {isSelected && (
                    <img
                      className="check-icon"
                      src={ic_pow}
                      alt={t('selectedAlt')}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {errors.background && (
            <p className="input-error-message">{errors.background}</p>
          )}
        </div>

        {!isEditMode && (
          <>
            <Input
              ref={passwordRef}
              labelName={t('password')}
              placeholder={t('passwordPlaceholder')}
              password={true}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: '' }));
              }}
              error={errors.password}
            />
            <Input
              labelName={t('passwordConfirm')}
              placeholder={t('passwordConfirmPlaceholder')}
              password={true}
              value={passwordCheck}
              onChange={(e) => {
                setPasswordCheck(e.target.value);
                setErrors((prev) => ({ ...prev, passwordCheck: '' }));
              }}
              error={errors.passwordCheck}
            />
          </>
        )}
      </div>

      <button
        className={`create-button ${isLoading ? 'loading' : ''}`}
        onClick={submitButtonClick}
        disabled={isLoading}
      >
        {isLoading
          ? t('creating')
          : isEditMode
            ? t('editSubmit')
            : t('createSubmit')}
      </button>
    </div>
  );
}

export default StudyForm;
