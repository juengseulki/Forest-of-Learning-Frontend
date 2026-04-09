import StudyList from '../feature/study/components/StudyList';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="main-container">
      <section>
        <p>최근 조회한 스터디</p>
        <StudyList />
      </section>
      <section>스터디 둘러보기</section>
    </div>
  );
}

export default HomePage;
