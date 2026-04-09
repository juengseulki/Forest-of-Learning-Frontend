import { useFocusTimer } from '../hooks/useFocusTimer';
import { Link } from 'react-router-dom';

export default function FocusTimer() {
  const {
    session,
    message,
    displayTime,
    mode,
    actualMinutes,
    handleStart,
    handlePause,
    handleResume,
    handleFinish,
    handleReset,
    durationMinutes,
    setDurationMinutes,
    TIMER_STATUS,
  } = useFocusTimer();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>오늘의 집중</h2>
        <div style={styles.navContainer}>
          <Link to="/habit">오늘의 습관</Link>

          <Link to="/">홈</Link>
        </div>
        <p style={styles.subText}>
          기준 시간 도달 시 3점 + 설정시간 1분당 1점, 초과 1분당 1점
        </p>

        {!session && (
          <div style={styles.section}>
            <label style={styles.label}>설정 시간(분)</label>

            <input
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              style={styles.input}
            />

            <div style={styles.buttonRow}>
              <button onClick={handleStart} style={styles.primaryButton}>
                Start
              </button>
            </div>
          </div>
        )}

        {session && session.status !== TIMER_STATUS.COMPLETED && (
          <div style={styles.section}>
            <div style={styles.timerBox}>
              <div style={styles.timerLabel}>
                {session.status === TIMER_STATUS.PAUSED
                  ? '일시정지 중'
                  : mode === 'COUNTDOWN'
                    ? '목표 집중 시간'
                    : '초과 집중 시간'}
              </div>

              <div
                style={
                  session.status === TIMER_STATUS.PAUSED
                    ? styles.timerValueStop
                    : mode === 'OVERTIME'
                      ? styles.timerValueActive
                      : styles.timerValue
                }
              >
                {displayTime}
              </div>
            </div>

            <div style={styles.infoBox}>
              <p style={styles.infoText}>현재 공부 시간: {actualMinutes}분</p>
              <p style={styles.infoText}>
                1차 저장 여부: {session.firstSaved ? '완료' : '대기중'}
              </p>
              <p style={styles.infoText}>현재 포인트: {session.totalPoint}점</p>
            </div>

            <div style={styles.buttonRow}>
              <button
                onClick={
                  session.status === TIMER_STATUS.PAUSED
                    ? handleResume
                    : handlePause
                }
                style={styles.greenButton}
              >
                {session.status === TIMER_STATUS.PAUSED ? '재개' : '일시정지'}
              </button>

              <button onClick={handleFinish} style={styles.darkButton}>
                종료
              </button>

              <button onClick={handleReset} style={styles.lightButton}>
                초기화
              </button>
            </div>
          </div>
        )}

        {session && session.status === TIMER_STATUS.COMPLETED && (
          <div style={styles.section}>
            <div style={styles.resultBox}>
              <h3 style={styles.resultTitle}>결과</h3>

              <p style={styles.infoText}>기본 포인트: {session.basePoint}점</p>
              <p style={styles.infoText}>
                설정 시간 보너스: {session.targetBonusPoint}점
              </p>
              <p style={styles.infoText}>
                초과 시간 포인트: {session.overtimePoint}점
              </p>

              <p style={styles.totalText}>총점: {session.totalPoint}점</p>
            </div>

            <button onClick={handleReset} style={styles.primaryButton}>
              다시 시작
            </button>
          </div>
        )}

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },

  card: {
    width: '100%',
    maxWidth: '720px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
  },

  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2f5d50',
    marginBottom: '20px',
  },

  subText: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '20px',
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },

  input: {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    width: '100%',
    boxSizing: 'border-box',
  },

  timerBox: {
    backgroundColor: '#f6f6f6',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
  },

  timerLabel: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '10px',
  },

  timerValue: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#444',
  },

  timerValueActive: {
    fontSize: '48px',
    fontWeight: '700',
    color: 'red',
  },

  timerValueStop: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#24A3FF',
  },

  infoBox: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#666',
  },

  infoText: {
    margin: '6px 0',
  },

  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },

  primaryButton: {
    padding: '8px 24px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#7ea87b',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },

  greenButton: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#A3FF66',
    color: '#333',
    fontSize: '14px',
    cursor: 'pointer',
  },

  darkButton: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#555',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },

  lightButton: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: '14px',
    cursor: 'pointer',
  },

  resultBox: {
    textAlign: 'center',
    fontSize: '14px',
  },

  resultTitle: {
    marginBottom: '10px',
  },

  totalText: {
    marginTop: '10px',
    fontWeight: '700',
  },

  message: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#2f5d50',
  },
};
