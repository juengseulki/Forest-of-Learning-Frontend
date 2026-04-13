import { useEffect, useMemo, useRef, useState } from 'react';

function useFocusTimerForm() {
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const [isEditing, setIsEditing] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [initialSeconds, setInitialSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const intervalRef = useRef(null);

  const totalSeconds = useMemo(() => {
    return Number(minutes || 0) * 60 + Number(seconds || 0);
  }, [minutes, seconds]);

  const handleMinutesChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMinutes(value);
  };

  const handleSecondsChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);

    if (Number(value) > 59) {
      setSeconds('59');
      return;
    }

    setSeconds(value);
  };

  const handleBlurMinutes = () => {
    setMinutes((prev) => String(Number(prev || 0)).padStart(2, '0'));
  };

  const handleBlurSeconds = () => {
    setSeconds((prev) => {
      const safe = Math.min(Number(prev || 0), 59);
      return String(safe).padStart(2, '0');
    });
  };

  const handleStart = () => {
    if (totalSeconds === 0) return;

    // 👉 처음 시작
    if (!isRunning && !isPaused) {
      setInitialSeconds(totalSeconds);
      setRemainingSeconds(totalSeconds);
    }

    // 👉 재시작 (resume)
    setIsPaused(false);
    setIsEditing(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsEditing(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsEditing(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setRemainingSeconds(0);
    setMinutes('00');
    setSeconds('00');
    setInitialSeconds(0);
  };

  useEffect(() => {
    if (!isRunning || isPaused) return;

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPaused]);

  const timerStatus = !isRunning
    ? 'idle'
    : remainingSeconds < 0
      ? 'overtime'
      : 'running';

  const isOvertime = timerStatus === 'overtime';

  const absSeconds = Math.abs(remainingSeconds);
  const displayMinutes = String(Math.floor(absSeconds / 60)).padStart(2, '0');
  const displaySec = String(absSeconds % 60).padStart(2, '0');

  return {
    minutes,
    seconds,
    isEditing,
    isRunning,
    timerStatus,
    isOvertime,
    isPaused,
    totalSeconds,
    initialSeconds,
    remainingSeconds,
    handleMinutesChange,
    handleSecondsChange,
    handleBlurMinutes,
    handleBlurSeconds,
    handleStart,
    handleStop,
    handleReset,
    handlePause,
    displayMinutes,
    displaySec,
  };
}

export default useFocusTimerForm;
