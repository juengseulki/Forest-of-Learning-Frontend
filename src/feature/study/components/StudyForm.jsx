import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/common/Input.jsx';
import '../../../styles/StudyForm.css';
import ic_pow from '../../../images/icon/ic_pow.svg';
import { createStudy, updateStudy } from '../../../api/studyApi.js';
import { getBackgrounds } from '../../../api/backgroundApi.js';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return '';

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
}

function StudyForm({ isEditMode = false, initialData = {}, onValidSubmit }) {
  const navigate = useNavigate();
  const { studyId } = useParams();
  const { t } = useTranslation();

  const [backgrounds, setBackgrounds] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);

  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [errors, setErrors] = useState({});

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

    setNickname(initialData.nickname ?? '');
    setName(initialData.name ?? '');
    setDescription(initialData.description ?? '');
    setSelectedBackground(initialData.background?.id ?? null);
  }, [isEditMode, initialData]);

  const submitButtonClick = async () => {
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
    if (Object.keys(newErrors).length > 0) return;

    const formData = {
      nickname,
      name,
      description,
      backgroundId: Number(selectedBackground),
    };

    if (onValidSubmit) {
      onValidSubmit(formData);
      return;
    }

    try {
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
      console.error('스터디 저장 실패:', error);
    }
  };

  return (
    <div className="form-container common-panel-md">
      <div className="form-wrapper">
        <p className="form-title">
          {isEditMode ? t('studyEdit') : t('studyCreate')}
        </p>

        <Input
          labelName={t('nickname')}
          placeholder={t('nicknamePlaceholder')}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error={errors.nickname}
        />

        <Input
          labelName={t('studyName')}
          placeholder={t('studyNamePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <div className="form-wrapper">
          <label className="input-label">{t('descriptionLabel')}</label>
          <textarea
            className="textarea-wrapper"
            placeholder={t('descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
              labelName={t('password')}
              placeholder={t('passwordPlaceholder')}
              password={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <Input
              labelName={t('passwordConfirm')}
              placeholder={t('passwordConfirmPlaceholder')}
              password={true}
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              error={errors.passwordCheck}
            />
          </>
        )}
      </div>

      <button className="create-button" onClick={submitButtonClick}>
        {isEditMode ? t('editSubmit') : t('createSubmit')}
      </button>
    </div>
  );
}

export default StudyForm;
