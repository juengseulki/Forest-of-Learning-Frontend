import Input from '../../../components/common/Input';

function StudyForm() {
  return (
    <div>
      <Input
        labelName="비밀번호"
        placeholder="비밀번호를 입력해 주세요"
        password={false}
      />
    </div>
  );
}

export default StudyForm;
