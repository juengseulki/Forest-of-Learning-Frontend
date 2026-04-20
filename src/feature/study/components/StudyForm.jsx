import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/common/Input';
import '../../../styles/StudyForm.css';
import ic_pow from '../../../images/icon/ic_pow.svg';
import { createStudy, updateStudy } from '../../../api/studyApi';
import { getBackgrounds } from '../../../api/backgroundApi';

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

    if (!nickname.trim()) newErrors.nickname = '*닉네임을 입력해주세요.';
    if (!name.trim()) newErrors.name = '*스터디 이름을 입력해주세요.';
    if (!selectedBackground) {
      newErrors.background = '*배경을 선택해주세요.';
    }

    if (!isEditMode) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/;

      if (!password) {
        newErrors.password = '*비밀번호를 입력해주세요.';
      } else if (!passwordRegex.test(password)) {
        newErrors.password =
          '*비밀번호는 5~20자의 영문 + 숫자 조합이어야 합니다.';
      }

      if (password !== passwordCheck) {
        newErrors.passwordCheck = '*비밀번호가 일치하지 않습니다.';
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
    <div className="form-container">
      <div className="form-wrapper">
        <p className="form-title">
          {isEditMode ? '스터디 수정하기' : '스터디 만들기'}
        </p>

        <Input
          labelName="닉네임"
          placeholder="닉네임을 입력해주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error={errors.nickname}
        />

        <Input
          labelName="스터디 이름"
          placeholder="스터디 이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <div className="form-wrapper">
          <label className="input-label">소개</label>
          <textarea
            className="textarea-wrapper"
            placeholder="소개 멘트를 작성해주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-wrapper">
          <label className="input-label">배경을 선택해주세요</label>
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
                    <img className="check-icon" src={ic_pow} alt="선택됨" />
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
              labelName="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              password={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <Input
              labelName="비밀번호 확인"
              placeholder="비밀번호를 다시 입력해주세요"
              password={true}
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              error={errors.passwordCheck}
            />
          </>
        )}
      </div>

      <button className="create-button" onClick={submitButtonClick}>
        {isEditMode ? '수정하기' : '만들기'}
      </button>
    </div>
  );
}

export default StudyForm;
