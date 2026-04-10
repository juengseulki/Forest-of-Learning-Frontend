import { useEffect, useMemo, useRef, useState } from 'react';

function useFocusTimerForm() {
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const [isEditing, setIsEditing] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const [initialSeconds, setInitialSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [toast, setToast] = useState(null);

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

  const handleStart = async () => {
    if (totalSeconds === 0) return;

    setInitialSeconds(totalSeconds);
    setRemainingSeconds(totalSeconds);
    setIsEditing(false);
    setIsRunning(true);

    setToast({
      message: '집중이 시작되었어요.',
      type: 'warning',
    });
  };

  const handleStop = async () => {
    setIsRunning(false);
    setIsEditing(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setToast({
      message: '집중이 종료되었어요.',
      type: 'success',
    });
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const timerStatus = !isRunning
    ? 'idle'
    : remainingSeconds < 0
      ? 'overtime'
      : 'running';

  const absSeconds = Math.abs(remainingSeconds);
  const displayMinutes = String(Math.floor(absSeconds / 60)).padStart(2, '0');
  const displaySec = String(absSeconds % 60).padStart(2, '0');

  return {
    minutes,
    seconds,
    isEditing,
    isRunning,
    timerStatus,
    totalSeconds,
    initialSeconds,
    remainingSeconds,
    handleMinutesChange,
    handleSecondsChange,
    handleBlurMinutes,
    handleBlurSeconds,
    handleStart,
    handleStop,
    displayMinutes,
    displaySec,
    toast,
    setToast,
  };
}

export default useFocusTimerForm;
