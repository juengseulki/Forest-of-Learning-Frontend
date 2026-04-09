import HabitRecordTable from "../feature/2-habit-gm/components/HabitRecordTable";

function HomePage() {
  return (
    <section>
      <h1>홈 페이지</h1>
      <p>여기에 홈 화면 내용이 들어갑니다.</p>
      <HabitRecordTable
        studyId={1}
        startDate="2026-04-07"
        endDate="2026-04-13"
      />
    </section>
  );
}

export default HomePage;
