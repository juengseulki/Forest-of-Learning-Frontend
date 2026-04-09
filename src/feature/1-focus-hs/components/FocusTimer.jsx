import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * localStorage에 저장할 키
 * → 브라우저 새로고침해도 데이터 유지됨
 */
const STORAGE_KEY = 'focus-session-test';

/**
 * 초 → mm:ss 형식으로 변환하는 함수
 */
function formatSeconds(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0');
  const seconds = String(safe % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

/**
 * localStorage에서 기존 세션 불러오기
 */
function getStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * 세션 저장
 */
function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

/**
 * 세션 초기화
 */
function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 1차 보상 계산
 * 기준 시간 도달 시:
 * - 기본 3점
 * - 설정시간(분) 만큼 추가
 */
function calculateFirstReward(durationMinutes) {
  return {
    basePoint: 3,
    targetBonusPoint: durationMinutes,
  };
}

/**
 * 2차 보상 계산
 * 초과한 분만큼 1점씩
 */
function calculateFinalReward(durationMinutes, actualMinutes) {
  const overtimeMinutes = Math.max(actualMinutes - durationMinutes, 0);

  return {
    overtimePoint: overtimeMinutes,
  };
}

export default function FocusTimerTest() {
  const [durationMinutes, setDurationMinutes] = useState(1);
  const [session, setSession] = useState(() => getStoredSession());
  const [message, setMessage] = useState('');

  const savingRef = useRef(false);

  const [now, setNow] = useState(() => {
    const stored = getStoredSession();

    if (stored?.status === 'PAUSED' && stored?.pausedAt) {
      return new Date(stored.pausedAt).getTime();
    }
    return Date.now();
  });

  /**
   * 타이머 + 1차 저장 처리
   */
  useEffect(() => {
    const timer = setInterval(() => {
      const currentNow = Date.now(); // 일시정지 충돌 방지

      setSession((prev) => {
        if (!prev) return prev;
        if (prev.status !== 'RUNNING') return prev;

        setNow(currentNow);

        if (prev.firstSaved) return prev;
        if (savingRef.current) return prev;

        const realElapsedMs =
          currentNow - new Date(prev.startedAt).getTime() - prev.totalPausedMs;
        const realElapsedMinutes = Math.floor(realElapsedMs / 60000);
        if (realElapsedMinutes < prev.durationMinutes) return prev;

        savingRef.current = true;

        const reward = calculateFirstReward(prev.durationMinutes);

        const updated = {
          ...prev,
          firstSaved: true,
          firstSavedAt: new Date(currentNow).toISOString(),
          basePoint: reward.basePoint,
          targetBonusPoint: reward.targetBonusPoint,
          totalPoint: reward.basePoint + reward.targetBonusPoint,
        };

        saveSession(updated);
        setMessage('기준 시간 도달! 1차 저장 완료');
        savingRef.current = false;

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /**
   * 목표 종료 시간
   */
  const plannedEnd = useMemo(() => {
    if (!session) return null;
    return new Date(session.plannedEndAt).getTime();
  }, [session]);

  /**
   * 시작 시간
   */
  const startedTime = useMemo(() => {
    if (!session) return null;
    return new Date(session.startedAt).getTime();
  }, [session]);

  /**
   * 남은 시간 / 초과 시간
   */
  const diffSeconds = useMemo(() => {
    if (!plannedEnd) return 0;
    return Math.floor((plannedEnd - now) / 1000);
  }, [plannedEnd, now]);

  /**
   * 실제 공부 시간(분)
   */
  const actualMinutes = useMemo(() => {
    if (!startedTime) return 0;
    const totalPausedMs = session?.totalPausedMs ?? 0;
    return Math.floor((now - startedTime - totalPausedMs) / 60000);
  }, [startedTime, now, session]);

  const mode = diffSeconds >= 0 ? 'COUNTDOWN' : 'OVERTIME';
  const displayTime = formatSeconds(Math.abs(diffSeconds));

  /**
   * 시작 버튼
   */
  const handleStart = () => {
    const start = new Date();
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const newSession = {
      id: Date.now(),
      durationMinutes,
      startedAt: start.toISOString(),
      plannedEndAt: end.toISOString(),
      status: 'RUNNING',
      firstSaved: false,
      finalSaved: false,
      basePoint: 0,
      targetBonusPoint: 0,
      overtimePoint: 0,
      totalPoint: 0,
      pausedAt: null, // 일시정지 시간 확인
      totalPausedMs: 0, // 누적 일시정지 시간
    };

    saveSession(newSession);
    setSession(newSession);
    setMessage('타이머 시작!');
    setNow(Date.now());
  };

  /**
   * 일시정지 함수
   */

  const handlePause = () => {
    const updated = {
      ...session,
      status: 'PAUSED',
      pausedAt: new Date().toISOString(),
    };
    saveSession(updated);
    setSession(updated);
    setMessage('일시정지');
  };

  const handleResume = () => {
    const currentNow = Date.now();
    const pausedMs = currentNow - new Date(session.pausedAt).getTime();
    const updated = {
      ...session,
      status: 'RUNNING',
      pausedAt: null,
      totalPausedMs: session.totalPausedMs + pausedMs,
      plannedEndAt: new Date(
        new Date(session.plannedEndAt).getTime() + pausedMs
      ).toISOString(),
    };
    saveSession(updated);
    setSession(updated);
    setNow(currentNow);
    setMessage('재개!');
  };

  /**
   * 종료 버튼
   */
  const handleFinish = () => {
    if (!session) return;

    const totalPausedMs = session.totalPausedMs ?? 0;

    const endTime =
      session.status === 'PAUSED'
        ? new Date(session.pausedAt).getTime()
        : Date.now();

    const actualMinutesNow = Math.floor(
      (endTime - new Date(session.startedAt).getTime() - totalPausedMs) / 60000
    );

    let next = { ...session };

    if (!session.firstSaved) {
      const realElapsedMs =
        endTime - new Date(session.startedAt).getTime() - totalPausedMs;
      const realElapsedMinutes = Math.floor(realElapsedMs / 60000);

      if (realElapsedMinutes >= session.durationMinutes) {
        const reward = calculateFirstReward(session.durationMinutes);
        next = {
          ...next,
          firstSaved: true,
          basePoint: reward.basePoint,
          targetBonusPoint: reward.targetBonusPoint,
          totalPoint: reward.basePoint + reward.targetBonusPoint,
        };
      }
    }

    const finalReward = calculateFinalReward(
      session.durationMinutes,
      actualMinutesNow
    );

    next = {
      ...next,
      status: 'COMPLETED',
      finalSaved: true,
      overtimePoint: finalReward.overtimePoint,
      totalPoint:
        next.basePoint + next.targetBonusPoint + finalReward.overtimePoint,
    };

    saveSession(next);
    setSession(next);
    setMessage('종료 완료!');
  };

  /**
   * 초기화
   */
  const handleReset = () => {
    clearSession();
    setSession(null);
    setMessage('초기화 완료');
    setNow(Date.now());
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>오늘의 집중</h2>
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

        {session && session.status !== 'COMPLETED' && (
          <div style={styles.section}>
            <div style={styles.timerBox}>
              <div style={styles.timerLabel}>
                {session.status === 'PAUSED'
                  ? '일시정지 중'
                  : mode === 'COUNTDOWN'
                    ? '목표 집중 시간'
                    : '초과 집중 시간'}
              </div>
              <div
                style={
                  session.status === 'PAUSED'
                    ? styles.timerValueStop
                    : mode === 'OVERTIME' && session.status === 'RUNNING'
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
                  session.status === 'PAUSED' ? handleResume : handlePause
                }
                style={styles.greenButton}
              >
                {session.status === 'PAUSED' ? '재개' : '일시정지'}
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

        {session && session.status === 'COMPLETED' && (
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
    backgroundColor: '#3f3f3f',
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

  darkButton: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#555',
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

  lightButton: {
    padding: '8px 20px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: '14px',
    cursor: 'pointer',
  },

  input: {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    width: '100%',
    boxSizing: 'border-box',
  },

  infoBox: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#666',
  },

  infoText: {
    margin: '6px 0',
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
