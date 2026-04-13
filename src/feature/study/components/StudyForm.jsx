import React, { useState } from 'react';
import Input from '../../../components/common/Input';
import '../../../styles/StudyForm.css';
import { backgroundsMockResponse } from '../../../mocks/background/backgroundMockData';
import ic_pow from '../../../images/icon/ic_pow.svg';

function StudyForm() {
  console.log(backgroundsMockResponse);
  const [background, setBackground] = useState(
    backgroundsMockResponse.data.items
  );
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');

  const submitButtonClink = () => {
    //api에 보낼 값
    const newData = {
      nickname,
      name,
      description,
      selectedBackground,
      password,
    };
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <p className="form-title">스터디 만들기</p>
        <Input
          labelName="닉네임"
          placeholder="닉네임을 입력해주세요"
          password={false}
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
          }}
        />
        <Input
          labelName="스터디 이름"
          placeholder="스터디 이름을 입력해주세요"
          password={false}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <div className="form-wrapper">
          <label className="input-label">소개</label>
          <textarea
            className="textarea-wrapper"
            placeholder="소개 멘트를 작성해주세요"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
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
        <Input
          labelName="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          password={true}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Input
          labelName="비밀번호 확인"
          placeholder="비밀번호를 다시입력해주세요"
          password={true}
        />
      </div>
      <button className="create-button" onClick={submitButtonClink}>
        만들기
      </button>
    </div>
  );
}

export default StudyForm;
