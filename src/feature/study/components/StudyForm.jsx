import React, { useState } from 'react';
import Input from '../../../components/common/Input';
import '../../../styles/StudyForm.css';
import { backgroundsMockResponse } from '../../../mocks/background/backgroundMockData';
import ic_pow from '../../../images/icon/ic_pow.svg';
import { createStudy, updateStudy } from '../../../api/studyApi';
import { useNavigate, useParams } from 'react-router-dom';

function StudyForm({ isEditMode = false, initialData = {} }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [background] = useState(backgroundsMockResponse.data.items);
  const [selectedBackground, setSelectedBackground] = useState(
    initialData.background?.id ?? 1
  );
  const [nickname, setNickname] = useState(initialData.nickname ?? '');
  const [name, setName] = useState(initialData.name ?? '');
  const [description, setDescription] = useState(initialData.description ?? '');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [errors, setErrors] = useState({
    nickname: '',
    name: '',
    description: '',
    password: '',
    passwordCheck: '',
  });

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/;

  const submitButtonClick = async () => {
    const newErrors = {};

    if (!nickname.trim()) {
      newErrors.nickname = '*닉네임을 입력해주세요.';
    } else if (nickname.length > 10) {
      newErrors.nickname = '*닉네임은 10자 이내입니다.';
    }

    if (!name.trim()) {
      newErrors.name = '*스터디 이름을 입력해주세요.';
    } else if (name.length > 20) {
      newErrors.name = '*스터디 이름은 20자 이내입니다.';
    }

    if (!isEditMode) {
      if (!password) {
        newErrors.password = '*비밀번호를 입력해주세요.';
      } else if (!passwordRegex.test(password)) {
        newErrors.password =
          '*비밀번호는 5~20자의 영문 + 숫자 조합이어야 합니다.';
      }

      if (!passwordCheck) {
        newErrors.passwordCheck = '*비밀번호를 확인해주세요.';
      } else if (password !== passwordCheck) {
        newErrors.passwordCheck = '*비밀번호가 일치하지 않습니다.';
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      if (isEditMode) {
        await updateStudy(id, {
          nickname,
          name,
          description,
          backgroundId: selectedBackground,
        });

        navigate(`/studies/${id}`);
        return;
      }

      const result = await createStudy({
        nickname,
        name,
        description,
        backgroundId: selectedBackground,
        password,
        passwordConfirm: passwordCheck,
      });

      navigate(`/studies/${result.id}`);
    } catch (error) {
      console.error(isEditMode ? '수정 에러:' : '생성 에러:', error);
      alert(
        isEditMode
          ? '스터디 수정에 실패했습니다.'
          : '스터디 생성에 실패했습니다.'
      );
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
          password={false}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error={errors.nickname}
        />

        <Input
          labelName="스터디 이름"
          placeholder="스터디 이름을 입력해주세요"
          password={false}
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
            {background.map((t) => {
              const isSelected = selectedBackground === t.id;

              return (
                <div
                  key={t.id}
                  className="background-item"
                  onClick={() => setSelectedBackground(t.id)}
                >
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="background-image"
                  />

                  {isSelected && (
                    <img className="check-icon" src={ic_pow} alt="선택됨" />
                  )}
                </div>
              );
            })}
          </div>
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
